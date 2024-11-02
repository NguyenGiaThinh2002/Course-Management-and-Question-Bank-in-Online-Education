import React, { useState } from "react";
// import "./storeClass.css";
import axios from '../../../services/axios';
import { useApp } from "../../../context/AppProvider";
export default function RestoreClass({ isEdit, closeEdit, editClassId }) {
    const {handleChilderRender} = useApp()
  if (!isEdit) {
    return null;
  }
  const restoreClass = () =>{
    const classID = editClassId._id;
    const restore = true;
    const thisStoreInfo = {
      restore: restore
    }
    axios.put(`class/storeClass/${classID}`, thisStoreInfo).then((response) => {
        console.log("thanh cong");
        handleChilderRender();
        closeEdit()
      })
      .catch((error) => {
        console.error("Error fetching class data for editing:", error);
      });
  }
  return (
    <div className="storeClass-modal-overlay">
      <div
        className="storeClass-model-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="">
          <div
            style={{
              fontSize: "20px",
              fontFamily: "Roboto, Arial, sans-serif",
              textAlign: "start",
              margin: "5px",
            }}
          >
            Khôi Phục {editClassId.className}?
          </div>

          <div className="storeClass-content">
            {" "}
            <div className="storeClass-content-item">
              Bạn cần khôi phục lớp để học để xem các thông tin và chỉnh sửa
            </div>
            <div className="storeClass-content-item">
              Khi khôi phục một lớp học, lớp đó sẽ được hồi phục cho đối với tất cả
              người tham gia và thêm lại liên kết với hệ thống thông tin học sinh
              (SIS) của bạn (nếu lớp học được liên kết).
            </div>
            {/* <div className="storeClass-content-item">
              Giáo viên hoặc học viên không thể sửa đổi các lớp đã lưu trữ, trừ
              phi các lớp đó được khôi phục.
            </div> */}
            <div className="storeClass-content-item">
              Lớp học này sẽ di chuyển sang các Lớp học hiện tại. Tệp lớp học sẽ
              vẫn còn trên Website.
            </div>
          </div>
          <div className="both-storeClass-button">
            <button className="common-button" onClick={closeEdit} >
              Huỷ
            </button>
            <button className="common-button" style={{color:"#1a73e8"}} onClick={restoreClass}>Khôi Phục</button>
          </div>
        </div>
      </div>
    </div>
  );
}
