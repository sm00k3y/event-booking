const DataLoader = require("dataloader");

const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../tools/date");

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      );
    });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const fetchedEvent = await eventLoader.load(eventId.toString());
    return fetchedEvent;
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return transformUser(user);
  } catch (err) {
    throw err;
  }
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: new Date(event._doc.date).toISOString(),
    creator: () => user(event.creator),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: () => user(booking._doc.user),
    event: () => singleEvent(booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

const transformUser = (singleUser) => {
  return {
    ...singleUser._doc,
    _id: singleUser.id,
    createdEvents: () => eventLoader.loadMany(singleUser._doc.createdEvents),
  };
};

// exports.user = user;
// exports.singleEvent = singleEvent;
// exports.events = events;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.transformUser = transformUser;
