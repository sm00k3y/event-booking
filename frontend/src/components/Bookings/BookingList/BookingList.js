import React from "react";
import "./BookingList.css";

const bookingList = ({ bookings, onCancel }) => {
  const retBookings = bookings.map((booking) => {
    return (
      <li key={booking._id} className="bookings__item">
        <div className="bookings__item-data">
          {booking.event.title} -{" "}
          {new Date(booking.createdAt).toLocaleDateString()}
        </div>
        <div>
          <button className="btn" onClick={() => onCancel(booking._id)}>
            Cancel
          </button>
        </div>
      </li>
    );
  });

  return <ul className="bookings__list">{retBookings}</ul>;
};

export default bookingList;
