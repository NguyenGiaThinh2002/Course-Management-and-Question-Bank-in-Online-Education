import React, { useEffect, useState } from "react";
import "./editClass.css";
import axios from "../../../services/axios";
import { useApp } from "../../../context/AppProvider";
import TextField from "@mui/material/TextField";
export default function EditClass({ isEdit, closeEdit, editClassId }) {
  const { setClassList } = useApp();
  const [formData, setFormData] = useState({
    // Khai báo các trường dữ liệu trong form
    className: "",
    classCode: "",
    description: "",
  });
  const [selectedClassData, setSelectedClassData] = useState(null);

  useEffect(() => {
    // Fetch data from the API for editing when the modal is opened in edit mode
    if (isEdit) {
      axios
        .get(`class/getClassById/${editClassId}`)
        .then((response) => {
          const { className, classCode, description } = response.data;
          setFormData({ className, classCode, description });
        })
        .catch((error) => {
          console.error("Error fetching class data for editing:", error);
        });
    }
  }, [isEdit, editClassId]);

  if (!isEdit) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setSelectedClassData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/class/updateClass/${editClassId}`,
        selectedClassData
      );
      const updatedClass = response.data;
      // window.location.reload();
      setClassList((prevClasses) =>
        prevClasses.map((prevClass) =>
          prevClass._id === editClassId ? updatedClass : prevClass
        )
      );

      console.log("Updated Class:", updatedClass);
      closeEdit();
      // Handle the updated class data as needed
    } catch (error) {
      console.error("Error updating class:", error);
    }
  };

  return (
    <div className="addClass-modal-overlay">
      <div
        className="addClass-model-content"
        onClick={(e) => e.stopPropagation()}
      >
        <form className="addClass-form" onSubmit={handleSubmit}>
          <h3 style={{ color: "black" }}>Chỉnh Sửa Lớp</h3>
          {/* <label className="addClass-item">
            Tên lớp:
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
            />
          </label> */}
          <TextField style={{width: "400px", margin: "10px"}} id="filled-basic" name="className" value={formData.className} onChange={handleChange} label="Tên lớp" variant="filled" />
          {/* <label className="addClass-item">
            Mã lớp:
            <input
              type="text"
              name="classCode"
              value={formData.classCode}
              onChange={handleChange}
            />
          </label> */}
          <TextField style={{width: "400px", margin: "10px"}} id="filled-basic" name="classCode" value={formData.classCode} onChange={handleChange} label="Mã lớp" variant="filled" />
          {/* <label className="addClass-item">
            Mô tả:
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label> */}
          <TextField style={{width: "400px", margin: "10px"}} id="filled-basic" name="description" value={formData.description} onChange={handleChange} label="Mô tả" variant="filled" />
          <div>
            <input type="submit" value="Submit" className="this-input" />
            <button className="close-button" onClick={closeEdit}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
