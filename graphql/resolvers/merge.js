const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../tools/date");

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
    return transformEvent(fetchedEvent);
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

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: new Date(event._doc.date).toISOString(),
    creator: user(event.creator),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    id: booking.id,
    user: user(booking._doc.user),
    event: singleEvent(booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

// exports.user = user;
// exports.singleEvent = singleEvent;
// exports.events = events;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
