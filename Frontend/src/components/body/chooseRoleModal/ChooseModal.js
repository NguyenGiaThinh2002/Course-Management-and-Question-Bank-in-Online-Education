import React from "react";
import { useApp } from "../../../context/AppProvider";
import "./chooseModal.css";
import student from "../../../asset/student.png";
import teacher from "../../../asset/teacher1.png";
import axios from "../../../services/axios";
export default function ChooseModal() {
  const { loginnedUserId, handleChilderRender } = useApp();
    const chooseRole = (role) =>{
        const userData = {
            role: role
          };
        const userId = loginnedUserId._id;
        try {
            axios.put(`auth/updateUserRole/${userId}`, userData).then(console.log("updateRole successfully"))
        } catch (error) {
            console.log("updateRole failed: " + error);
        }
        handleChilderRender()
    }
  return (
    <div className="chooseModal-modal-overlay">
      <div className="chooseModal-model-content">
        <div className="choose-role">CHỌN VAI TRÒ</div>
        <div className="cover-role-container">
          <div className="role-container"  onClick={()=>chooseRole("student")}>
            <img className="role-image" src={student} alt=""></img>
            <div className="role-name">TÔI LÀ HỌC SINH</div>
          </div>
          <div className="role-container"  onClick={()=>chooseRole('waitingTeacher')}>
            <img className="role-image" src={teacher} alt=""></img>
            <div className="role-name">TÔI LÀ GIÁO VIÊN</div>
          </div>
        </div>
        {/* <div>{loginnedUserId.role}</div> */}
      </div>
    </div>
  );
}
