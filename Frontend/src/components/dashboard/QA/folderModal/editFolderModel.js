import React, { useEffect, useState } from "react";
// import "./createFolderModal.css";
import { useApp } from "../../../../context/AppProvider";
import axios from "../../../../services/axios";
import TextField from "@mui/material/TextField";

export default function EditFolderClass({ isOpen, onClose, editFolderId }) {
  const {selectedClass, handleChilderRender} = useApp();
  const [formData, setFormData] = useState({
    folderName: "",
  });

//   useEffect(() => {
//     // Fetch data from the API for editing when the modal is opened in edit mode
//     if (isOpen) {
//       axios
//         .get(`class/getClassById/${editFolderId}`)
//         .then((response) => {
//           const { className, classCode, description } = response.data;
//           setFormData({ className, classCode, description });
//         })
//         .catch((error) => {
//           console.error("Error fetching class data for editing:", error);
//         });
//     }
//   }, [isOpen, editFolderId]);
  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      classID: selectedClass._id,
    });
  };
   const handleSubmit = (e) => {
    e.preventDefault();
    // Gửi dữ liệu formData lên backend thông qua Axios
    console.log('This is a submit: '+ formData.folderName);
    console.log('This is a submit: '+ formData.classID);

     axios
      .post("classFolder/createClassFolder", formData)
      .then((response) => {
        setFormData({
            folderName: "",
          });
        console.log("this is new createClassFolder", response.data);
        //setClassList((prevClasses) => [...prevClasses, response.data]);
        handleChilderRender();
        onClose();
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
        {/*  */}
        <form className="addClass-form" onSubmit={handleSubmit}>
          <h3 style={{ color: "black"}}>Thêm Thư Mục</h3>
          <TextField style={{width: "400px", margin: "10px"}} id="filled-basic" name="folderName" value={formData.folderName} onChange={handleChange} label="Tên Thư Mục" variant="filled" />
          <div>
            <input type="submit" value="Lưu Lại" className="this-input"/>
            <button className="close-button" onClick={onClose}>
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
