import React from "react";
import EventItem from "./EventItem/EventItem";
import "./EventList.css";

const eventList = ({ events, loggedUserId, onViewDetail }) => {
  const renderEvents = () => {
    const eventList = events.map((event) => {
      return (
        <EventItem
          key={event._id}
          event={event}
          loggedUserId={loggedUserId}
          onDetail={onViewDetail}
        />
      );
    });
    return eventList;
  };

  return <ul className="events__list">{renderEvents()}</ul>;
};

export default eventList;
