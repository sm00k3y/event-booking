import React from "react";

import "./EventItem.css";

const EventItem = ({ event, loggedUserId, onDetail }) => {
  return (
    <li className="events__list-item">
      <div>
        <h1>{event.title}</h1>
        <h2>
          ${event.price} - {new Date(event.date).toLocaleDateString("pl-PL")}
        </h2>
        {/* <p>{event.creator._id}</p>
        <p>{loggedUserId}</p> */}
      </div>
      <div>
        {loggedUserId === event.creator._id ? (
          <p>Your the owner of this event.</p>
        ) : (
          <button className="btn" onClick={() => onDetail(event._id)}>
            View Details
          </button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
