import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import authContext from "../../context/auth-context";
import "./MainNavigation.css";

const MainNavigation = () => {
  const loggedUser = useContext(authContext);

  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {loggedUser.token && (
            <li>
              <NavLink to="/bookings">Bookings</NavLink>
            </li>
          )}
          {!loggedUser.token && (
            <li>
              <NavLink to="/auth">Authentication</NavLink>
            </li>
          )}
          {loggedUser.token && (
            <li>
              <button onClick={loggedUser.logout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
