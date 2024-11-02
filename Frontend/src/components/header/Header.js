import React, { useState } from "react";
import "./header.css";
import { useAuth } from "../../context/AuthProvider";
import { useApp } from "../../context/AppProvider";
import Modal from "../modal/Modal";
import AddClassModal from "../modal/addClass/AddClass";
import FindModal from "../modal/findModal/FindModal";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchIcon from "@mui/icons-material/Search";
import classroom from "./classroom.png";
export default function Header({ onClose }) {
  const {headerColor} = useApp();
  const { user } = useAuth();
  const { selectedClass, loginnedUserId } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenAddClassModal, setopenAddClassModal] = useState(false);
  const [isOpenFindClassModal, setopenFindClassModal] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openAddClassModal = () => {
    setopenAddClassModal(true);
  };

  const closeAddClassModal = () => {
    setopenAddClassModal(false);
  };

  const openFindClassModal = () => {
    setopenFindClassModal(true);
  };

  const closeFindClassModal = () => {
    setopenFindClassModal(false);
  };
  return (
    <div >
      <header className="header" style={{backgroundColor: headerColor}}>
        <div className="thinh">
          <button className="sidebar-toggle" onClick={onClose}>
            <i className="fas fa-bars"></i>
          </button>
          <div>
            <img src={classroom} alt="" className="classroom-photo" />
          </div>
          <div className="lop-hoc">
            <h2>Lớp học </h2>
            {selectedClass.className && (
              <div className="ten-lop-hoc">
                <span></span>
                <h2>&gt; {selectedClass.className}</h2>
              </div>
            )}
          </div>
        </div>

        <div className="header-content">
          <nav className="nav">
            <ul className="ul">
              <li>
                <Modal isOpen={isModalOpen} onClose={closeModal} />
              </li>

              {loginnedUserId?.role === "student" && (
                <li className="search-icon">
                  <SearchIcon onClick={openFindClassModal} style={{ width: "50px", fontSize: "30px" }} />
                </li>
              )}

              <div>
                {loginnedUserId?.role === "teacher" && (
                  <a
                    href="#"
                    role="button"
                    onClick={openAddClassModal}
                    className="search-icon"
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{
                        width: "25px",
                        height: "25px",
                        fontSize: "5px",
                      }}
                    />
                  </a>
                )}
              </div>

              <a href="#" role="button" onClick={openModal}>
                <img className="photo" src={user.photoURL} alt="" />
              </a>
            </ul>
          </nav>
        </div>
      </header>
      <AddClassModal
        isOpen={isOpenAddClassModal}
        onClose={closeAddClassModal}
      />
            <FindModal
        isOpen={isOpenFindClassModal}
        onClose={closeFindClassModal}
      />
    </div>
  );
}
