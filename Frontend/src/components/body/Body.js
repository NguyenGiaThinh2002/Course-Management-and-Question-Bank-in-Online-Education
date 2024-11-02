import React, { useState } from "react";
import "../body/body.css";
import Dashboard from "../dashboard/Dashboard";
import Classroom from "../classroom/ClassRoom";
import { useApp } from "../../context/AppProvider";
import ChooseModal from "./chooseRoleModal/ChooseModal";
export default function Body({ isOpen}) {
  const { selectedClass, loginnedUserId } = useApp();
  const [selectedIndex, setSelectedIndex] = useState(null);
  return (
    <div className="this-body">
      <div className={`body-overlay ${isOpen ? "open" : ""}`}>
        {loginnedUserId.role === "empty" &&   <ChooseModal />}
        {loginnedUserId.role === "waitingTeacher" && <>   <h1 style={{textAlign:"start", margin: "40px", color: "red"}}>Vui Lòng Chờ Đợi Người Quản Lý Chấp Nhận. Chúng Tôi Sẽ Xử Lý Trong Vòng 24 Giờ</h1></>}
        {selectedClass._id && <Dashboard selectedIndex={selectedIndex} />}
        {!selectedClass._id && <Classroom onIndexSelect={setSelectedIndex}/>}
      </div>
    </div>
  );
}
