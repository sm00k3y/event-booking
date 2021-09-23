import React from "react";
import "./Spinner.css";
import Fox from "./fox.svg";

const spinner = () => {
  return (
    <div className="spinner">
      {/* <div className="lds-dual-ring"></div> */}
      <img src={Fox} />
    </div>
  );
};

export default spinner;
