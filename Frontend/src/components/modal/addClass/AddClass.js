import React, { useState } from "react";
import "./addClass.css";
import axios from "../../../services/axios";
import { useAuth } from "../../../context/AuthProvider";
import { useApp } from "../../../context/AppProvider";
import TextField from "@mui/material/TextField";
export default function AddClass({ isOpen, onClose }) {
  const {loginnedUserId, setClassList} = useApp();
  const [formData, setFormData] = useState({
    // Khai báo các trường dữ liệu trong form
    className: "",
    classCode: "",
    description: "",
  });
  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      teacherID: loginnedUserId,
    });
  };
   const handleSubmit = (e) => {
    e.preventDefault();
    // Gửi dữ liệu formData lên backend thông qua Axios
     axios
      .post("class/createClass", formData)
      .then((response) => {
        // console.log("User successfully stored in MongoDB:", response.data);
        setFormData({
            className: "",
            classCode: "",
            description: "",
            teacherID: loginnedUserId,
          });
        //  window.location.reload();
        console.log("this is new class", response.data);
        setClassList((prevClasses) => [...prevClasses, response.data]);

        onClose()
      })
      .catch((error) => {
        console.error("Error storing user in MongoDB:", error);
      });
  }
  return (
    <div className="addClass-modal-overlay">
      <div
        className="addClass-model-content"
        onClick={(e) => e.stopPropagation()}
      >
        
        <form className="addClass-form" onSubmit={handleSubmit}>
          <h3 style={{ color: "black"}}>Thêm Lớp</h3>
          <TextField style={{width: "400px", margin: "10px"}} id="filled-basic" name="className" value={formData.className} onChange={handleChange} label="Tên lớp" variant="filled" />
          <TextField style={{width: "400px", margin: "10px"}} id="filled-basic" name="classCode" value={formData.classCode} onChange={handleChange} label="Mã lớp" variant="filled" />
          <TextField style={{width: "400px", margin: "10px"}} id="filled-basic" name="description" value={formData.description} onChange={handleChange} label="Mô tả" variant="filled" />
          <div>
            <input type="submit" value="Submit" className="this-input"/>
            <button className="close-button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
