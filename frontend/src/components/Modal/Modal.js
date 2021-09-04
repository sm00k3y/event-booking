import React from "react";
import "./Modal.css";

const modal = (props) => {
  return (
    <div className="modal">
      <header className="modal__header">
        <h1>{props.title}</h1>
      </header>
      <section className="modal__content">{props.children}</section>
      <section className="modal__actions">
        {props.canConfirm && (
          <button className="btn" onClick={props.onConfirm}>
            {props.confirmText}
          </button>
        )}
        {props.canCancel && (
          <button className="btn" onClick={props.onCancel}>
            Cancel
          </button>
        )}
      </section>
    </div>
  );
};

export default modal;
