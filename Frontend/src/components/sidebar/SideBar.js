import React, { useState } from "react";
import "./sidebar.css";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHome,
  faChalkboard,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../context/AppProvider";

// tao repos tren github MSSV, Hoten, Frontend(Backend), nao thay gui thi nop
export default function SideBar({ isOpen, onClose }) {
  const {
    setClassEmpty,
    handleSetOpenStoringClasses,
    handleSetCloseStoringClasses,
    handleSetOpenSettings,
    handleSetCloseSettings,
    sidebarColor
  } = useApp();
  // const [sidebarColor, setSidebarColor] = useState("#00274e");
  // const handleChangeColor = (e) => {
  //   setSidebarColor(e.target.value);
  // };
  // if(sidebarColor){
  //   var thisSidebarColor = sidebarColor

  // }else{
  //   var thisSidebarColor = "#00274e";
  // }
  return (
    // onMouseOver={isOpen ? onClose : undefined} onMouseOut={isOpen ? onClose : undefined}
    <div
      className={`sidebar ${isOpen ? "open" : ""}`}
      style={{ backgroundColor: sidebarColor }}
    >
      <div className="sidebar-header"></div>
      <div className="sidebar-content">
        <ul className="nav-links">
          <li>
            <Link
              to="#"
              onClick={() => {
                setClassEmpty();
                handleSetCloseStoringClasses();
                handleSetCloseSettings();
              }}
            >
              <FontAwesomeIcon icon={faHome} className="icon" />
              {/* { !isOpen && <div>Màn hình chính</div> } */}
              <div className="sidebar-text">Màn hình chính</div>
            </Link>
          </li>
          <li>
            <Link
              to="#"
              onClick={() => {
                handleSetOpenStoringClasses();
                handleSetCloseSettings();
              }}
            >
              <FontAwesomeIcon icon={faChalkboard} className="icon" />
              <div className="sidebar-text">Lớp học đã lưu trữ</div>
              {/* { !isOpen && <div><FontAwesomeIcon icon={faChalkboard} className='icon'/>Lớp Học</div> } */}
            </Link>
          </li>

          <li>
            <Link to="#" onClick={() => handleSetOpenSettings()}>
              <FontAwesomeIcon icon={faCog} className="icon" />
              <div className="sidebar-text">Cài đặt</div>
              {/* { !isOpen && <div><FontAwesomeIcon icon={faCog} className='icon'/>Cài đặt</div> } */}
            </Link>
          </li>
          <li>
            {/* <input
              type="color"
              value={sidebarColor}
              onChange={handleChangeColor}
            /> */}
            {/* thinh */}
            {/* <div className="color-picker">
              <input
                type="color"
                value={sidebarColor}
                onChange={handleChangeColor}
                style={{ border: "1px solid black" }}
              />
              <div
                className="color-indicator"
                style={{ backgroundColor: sidebarColor }}
                onClick={() => {
                  const newColor = prompt(
                    "Enter a new color (hexadecimal or RGB):"
                  );
                  if (newColor) {
                    setSidebarColor(newColor);
                  }
                }}
              ></div>
            </div>
            <p>
              Click the color indicator or use the color picker to change the
              sidebar color
            </p> */}

            {/* <p>Drag the slider to change the sidebar color</p> */}
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </div>
    </div>
  );
}
