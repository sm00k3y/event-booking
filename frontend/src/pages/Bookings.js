import React, { useState, useEffect, useContext } from "react";
import authContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Bookings/BookingList/BookingList";
import BookingChart from "../components/Bookings/BookingChart/BookingChart";
import BookingControls from "../components/Bookings/BookingControls/BookingControls";

const BookingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const loggedUser = useContext(authContext);
  const [isActive, setIsActive] = useState(true);
  const [outputType, setOutputType] = useState("list");

  useEffect(() => {
    fetchBookings();
    return () => {
      setIsActive(false);
    };
  }, []);

  const fetchBookings = () => {
    console.log("Fetching Bookings...");
    setLoading(true);
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
              price
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
        const bookings = resData.data.bookings;
        if (isActive) setBookings(bookings);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        if (isActive) setLoading(false);
      });
  };

  const cancelBookingHandler = (bookingId) => {
    setLoading(true);
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!){
          cancelBooking(bookingId: $id) {
            _id
            title
            date
          }
        }
      `,
      variables: {
        id: bookingId,
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
        if (isActive) {
          setBookings(
            bookings.filter((b) => {
              return b._id !== bookingId;
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        if (isActive) setLoading(false);
      });
  };

  const changeOutputTypeHandler = (outputType) => {
    if (outputType === "list") {
      setOutputType("list");
    } else {
      setOutputType("chart");
    }
  };

  const tabs = () => {
    return (
      <React.Fragment>
        <BookingControls
          onChange={changeOutputTypeHandler}
          activeOutputType={outputType}
        />
        <div>
          {outputType === "list" ? (
            <BookingList bookings={bookings} onCancel={cancelBookingHandler} />
          ) : (
            <BookingChart bookings={bookings} />
          )}
        </div>
      </React.Fragment>
    );
  };

  if (loading) {
    return <Spinner />;
  } else {
    return tabs();
  }
  // return (
  //   <React.Fragment>
  //     {loading ? <Spinner /> : <React.Fragment>{tabs()}</React.Fragment>}
  //   </React.Fragment>
  // );
};

export default BookingsPage;
