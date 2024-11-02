import React, { useState } from "react";
import "./storeClass.css";
import axios from '../../../services/axios';
import { useApp } from "../../../context/AppProvider";
export default function StoreClass({ isEdit, closeEdit, editClassId }) {
    const {handleChilderRender} = useApp()
  if (!isEdit) {
    return null;
  }
  const storeClass = () =>{
    const classID = editClassId._id;
    const restore = false;
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
            Lưu trữ {editClassId.className}?
          </div>

          <div className="storeClass-content">
            {" "}
            <div className="storeClass-content-item">
              Khi lưu trữ một lớp học, lớp đó sẽ được lưu trữ đối với tất cả
              người tham gia và sẽ huỷ liên kết với hệ thống thông tin học sinh
              (SIS) của bạn (nếu lớp học được liên kết).
            </div>
            <div className="storeClass-content-item">
              Giáo viên hoặc học viên không thể sửa đổi các lớp đã lưu trữ, trừ
              phi các lớp đó được khôi phục.
            </div>
            <div className="storeClass-content-item">
              Lớp học này sẽ di chuyển sang Lớp học đã lưu trữ. Tệp lớp học sẽ
              vẫn còn trên Website.
            </div>
          </div>
          <div className="both-storeClass-button">
            <button className="common-button" onClick={closeEdit} >
              Huỷ
            </button>
            <button className="common-button" style={{color:"#1a73e8"}} onClick={storeClass}>Lưu Trữ</button>
          </div>
        </div>
      </div>
    </div>
  );
}
