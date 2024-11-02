import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot
import "./alert.css"; // Add your CSS for the alert

let alertResolve;

const AlertComponent = ({ type, message, onResolve }) => {
  const handleClose = (result) => {
    onResolve(result); // Resolve the promise
    hideAlert(); // Hide the alert after handling
  };

  return (
    <div className="custom-alert">
      <div className="alert-content">
        <span>{message}</span>
        <div className="alert-buttons">
          {type === "confirm" ? (
            <>
              <button onClick={() => handleClose(true)}>Có</button>
              <button onClick={() => handleClose(false)}>Không</button>
            </>
          ) : (
            <button onClick={() => handleClose(true)}>Đồng ý</button>
          )}
        </div>
      </div>
    </div>
  );
};

// Function to handle the display and removal of the alert component
let alertRoot = null;

const showAlert = (type, message) => {
  return new Promise((resolve) => {
    alertResolve = resolve;
    show(type, message);
  });
};

const show = (type, message) => {
  const alertContainer = document.createElement("div");
  alertContainer.id = "alert-container";
  document.body.appendChild(alertContainer);

  alertRoot = createRoot(alertContainer); // Create root for React 18
  alertRoot.render(
    <AlertComponent
      type={type}
      message={message}
      onResolve={(result) => alertResolve(result)}
    />
  );
};

const hideAlert = () => {
  if (alertRoot) {
    alertRoot.unmount(); // Properly unmount in React 18
  }
  const alertContainer = document.getElementById("alert-container");
  if (alertContainer) {
    document.body.removeChild(alertContainer);
  }
};

export default showAlert;
