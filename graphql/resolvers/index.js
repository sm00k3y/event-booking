const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: new Date(event._doc.date).toISOString(),
    creator: user(event.creator),
  };
};

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const fetchedEvent = await Event.findById(eventId);
    return {
      ...fetchedEvent._doc,
      _id: fetchedEvent.id,
      creator: user(fetchedEvent.creator),
    };
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      id: user.id,
      createdEvents: events(user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  users: async () => {
    try {
      const users = await User.find();
      return users.map((singleUser) => {
        return { ...singleUser._doc, _id: singleUser.id };
      });
    } catch (err) {
      throw err;
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          id: booking.id,
          user: user(booking._doc.user),
          event: singleEvent(booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args) => {
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: "6129fe910070d2210ff1e757",
      });
      let createdEvent;
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById("6129fe910070d2210ff1e757");
      if (!creator) {
        throw new Error("User doesn't exist!");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exists already!");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const result = await user.save();
      return { ...result._doc, password: null, id: result.id };
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async ({ eventId }) => {
    const fetchedEvent = await Event.findOne({ _id: eventId });
    const booking = new Booking({
      user: "6129fe910070d2210ff1e757",
      event: fetchedEvent,
    });
    const result = await booking.save();
    return {
      ...result._doc,
      _id: result.id,
      user: user(booking._doc.user),
      event: singleEvent(booking._doc.event),
      createdAt: new Date(booking._doc.createdAt).toISOString(),
      updatedAt: new Date(booking._doc.updatedAt).toISOString(),
    };
  },
  cancelBooking: async ({ bookingId }) => {
    try {
      const booking = await Booking.findById(bookingId).populate("event");
      const event = {
        ...booking.event._doc,
        _id: booking.event._doc.id,
        creator: user(booking.event._doc.creator),
      };
      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
