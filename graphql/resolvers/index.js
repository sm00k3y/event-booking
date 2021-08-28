const authResolver = require("./auth");
const eventsResolver = require("./events");
const bookingsResolver = require("./bookings");

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingsResolver,
};

module.exports = rootResolver;
