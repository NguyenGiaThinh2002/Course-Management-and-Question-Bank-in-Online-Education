import React from "react";
import "../modal/modal.css";
import { useAuth } from "../../context/AuthProvider";
export default function Modal({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  if (!isOpen) {
    return null;
  }
  function handleLogout() {
    logout();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      {user && (
        <div>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {user.email}
            <img src={user.photoURL} alt="" className="modal-photo" />
            <div> Chao {user.username}</div>
            <div className="both-button">
              <button onClick={handleLogout} >Logout</button>
              <button className="close-button" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// Modal.js
