import React, { useState } from "react";
import './findModal.css'
import axios from "../../../services/axios";
import { useAuth } from "../../../context/AuthProvider";
import { useApp } from "../../../context/AppProvider";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
export default function FindModal({ isOpen, onClose }) {
  const { loginnedUserId, setClassList, classList, findPerson } = useApp();
  const [foundClass, setFoundClass] = useState({});
  const [teacherOfClass, setTeacherOfClass] = useState({});
  const [formData, setFormData] = useState({
    // Khai báo các trường dữ liệu trong form
    className: "",
    classCode: "",
    description: "",
  });
  if (!isOpen) {
    return null;
  }
  const addToWaitingList = async () => {
    const classID = foundClass._id;
    const studentID = [loginnedUserId._id];
    console.log(classID);
    console.log(studentID);
    const listData = {
        classID: classID,
        studentID: studentID
    }
    try {
        // Make an HTTP POST request to add selected users to the class
        const response = await axios.post('auth/addWaitingStudent', listData);
        console.log(response);
        // setNotification((prevClasses) => [...prevClasses, response.data.result]);
        // const listStudents = await axios.get('/auth/getUserById', {
        //   params: {
        //     listIds: response.data.result.studentID
        //   }
        // });
        // console.log(listStudents.data);
        if (response.data.error){
            alert(response.data.error)
        }else{
            alert("Bạn đã yêu cầu tham gia thành công")
        }

        // setStudentList(listStudents.data);   
        // setSelectedClassRoomId((prevClasses) => [...prevClasses, response.data.result]);
        onClose()
        // console.log('Server response:', response.data.result.studentID);

      } catch (error) {
        console.error('Error adding selected users to class:', error);
      }
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
    // const foundClass = classList.find((class) => class.classCode === formData.className);
    // const thisClassCode = formData.className.toString();
    const foundClass = classList?.find(
      (cls) => cls.classCode === formData.className
    );
    if(foundClass){
        const teacherOfClass = findPerson(foundClass.teacherID);
        setTeacherOfClass(teacherOfClass);
    }
    setFoundClass(foundClass);
  };
  return (
    <div className="addClass-modal-overlay">
      <div
        className="addClass-model-content"
        onClick={(e) => e.stopPropagation()}
        style={{position: "relative"}}
      >
          <HighlightOffIcon style={{position:"absolute", top:"20", right:"20", fontSize:"30px"}} onClick={onClose} />
        <form className="addClass-form" onSubmit={handleSubmit} >
          
          <h3 style={{ color: "black" }}>Tìm Lớp Học</h3>
          <div
            style={{
              display: " flex",
              alignItems: "center",
              marginLeft: "20px",
            }}
          >
            <TextField
              style={{ width: "400px", margin: "20px" }}
              id="filled-basic"
              name="className"
              value={formData.className}
              onChange={handleChange}
              label="Nhập Mã Lớp"
              variant="filled"
            />
            <div className="search-icon" onClick={handleSubmit}>
              {/* <input type="submit" value="Submit" className="this-input" /> */}
              <SearchIcon style={{ width: "50px", fontSize: "30px" }} />
            </div>
          </div>
          <div style={{display: "flex", justifyContent: "center"}}>
            {foundClass?.className && (
              <div className="join-group">
                <div style={{display:"flex", flexDirection:"column", alignItems: "start"}}>
                  <div>Lớp: {foundClass?.className}</div>
                  <div>Giáo Viên: {teacherOfClass?.username}</div>
                </div>
                <div>
                  <GroupAddIcon onClick={()=>addToWaitingList()}/>
                </div>
              </div>
            )}
            {!foundClass && (
              <div>
                <div>Không tìm thấy lớp nào</div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
