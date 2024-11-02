import React, { useState } from "react";
import "../dashboard/dashboard.css";
import { useApp } from "../../context/AppProvider";
import Main from './main/Main'
import People from './people/People'
import Assignment from "./assignment/Assignment";
import Grade from "./grade/Grade";
import QApage from './QA/QApage';
import TestGeneration from "./testGeneration/TestGeneration";
export default function Dashboard( {selectedIndex}) {
  const { loginnedUserId } = useApp()
  const [selectedNavItem, setSelectedNavItem] = useState(0);
  const handleNavItemClick = (index) => {
    setSelectedNavItem(index);
  };

  return (
    <div className="body-container" >
      <div className="nav-bar">
        <div
          className={`nav-item ${selectedNavItem === 0 ? "selected" : ""}`}
          onClick={() => handleNavItemClick(0)}
        >
          Bản tin
        </div>
        <div
          className={`nav-item ${selectedNavItem === 1 ? "selected" : ""}`}
          onClick={() => handleNavItemClick(1)}
        >
          Bài tập trên lớp
        </div>
        <div
          className={`nav-item ${selectedNavItem === 2 ? "selected" : ""}`}
          onClick={() => handleNavItemClick(2)}
        >
          Mọi người
        </div>
        <div
          className={`nav-item ${selectedNavItem === 3 ? "selected" : ""}`}
          onClick={() => handleNavItemClick(3)}
        >
          Điểm
        </div>
        <div
          className={`nav-item ${selectedNavItem === 4 ? "selected" : ""}`}
          onClick={() => handleNavItemClick(4)}
        >
          Ngân hàng câu hỏi
        </div>
        <div
          className={`nav-item ${selectedNavItem === 5 ? "selected" : ""}`}
          onClick={() => handleNavItemClick(5)}
        >
          Tạo đề thi
        </div>
      </div>
      <div className="content-container">
        {selectedNavItem === 0 &&  <Main selectedIndex={selectedIndex}/>}
        {selectedNavItem === 1 &&  <Assignment/>}
        {selectedNavItem === 2 &&  <People/>}
        {selectedNavItem === 3 && loginnedUserId.role === 'teacher' &&  <Grade/>}
        {selectedNavItem === 4 && loginnedUserId.role === 'teacher' &&  <QApage/>}
        {selectedNavItem === 5 && loginnedUserId.role === 'teacher' && <TestGeneration/>}
        </div>
    </div>
  );
}
