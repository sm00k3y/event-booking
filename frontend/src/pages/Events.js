import React, { useState, useRef, useContext, useEffect } from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import "./Events.css";
import authContext from "../context/auth-context";
import EventList from "../components/Events/EventList";
import Spinner from "../components/Spinner/Spinner";

const EventsPage = () => {
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const titleEl = useRef();
  const priceEl = useRef();
  const dateEl = useRef();
  const descriptionEl = useRef();
  const loggedUser = useContext(authContext);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isActive, setIsActive] = useState(true);

  const fetchEvents = () => {
    setLoading(true);
    console.log("Fetching...");
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `,
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        if (isActive) setEvents(events);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        if (isActive) setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
    return () => {
      setIsActive(false);
    };
  }, []);

  const startCreateEventHandler = () => {
    setCreating(true);
  };

  const modalConfirmHandler = () => {
    setCreating(false);
    const title = titleEl.current.value;
    const price = +priceEl.current.value;
    const date = dateEl.current.value;
    const desc = descriptionEl.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      desc.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description: desc };
    console.log(event);

    const requestBody = {
      query: `
        mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String! ){
          createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
            _id
            title
            description
            date
            price
          }
        }
      `,
      variables: {
        title: title,
        description: desc,
        price: price,
        date: date,
      },
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedUser.token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        const newEvent = resData.data.createEvent;
        newEvent.creator = { _id: loggedUser.userId };
        setEvents([...events, newEvent]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null);
  };

  const showDetailHandler = (eventId) => {
    setSelectedEvent(events.find((e) => e._id === eventId));
  };

  const bookEventHandler = () => {
    if (!loggedUser.token) {
      setSelectedEvent(null);
      return;
    }
    const requestBody = {
      query: `
        mutation BookEvent($id: ID!){
          bookEvent(eventId: $id) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: selectedEvent._id,
      },
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedUser.token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        setSelectedEvent(null);
      });
  };

  return (
    <React.Fragment>
      {(creating || selectedEvent) && <Backdrop />}
      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleEl} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceEl} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateEl} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="4" ref={descriptionEl} />
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText={loggedUser.token ? "Book this Event" : "Confirm"}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{" "}
            {new Date(selectedEvent.date).toLocaleDateString("pl-PL")}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {loggedUser.token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}
      {loading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          loggedUserId={loggedUser.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </React.Fragment>
  );
};

export default EventsPage;
