import React, { useState } from "react";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InviteModal from "./modal/Invite";
import { useApp } from "../../../context/AppProvider";
import "../people/people.css";
import axios from "../../../services/axios";
export default function People() {
  const { studentList, loginnedUserId, waitingStudentList, selectedClass, setWaitingStudentList, setStudentList } = useApp();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    console.log(studentList);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const accpectStudent = async (id) => {

    const studentData = {
      classID: selectedClass._id,
      studentID: id,
      acceptance: true,
    }
    console.log(studentData);
    const response = await axios.post('auth/setWaitingStudents', studentData, { timeout: 10000 })
 
      const listStudents = await axios.get('/auth/getUserById', {
        params: {
          listIds: response.data.result.studentID
        }
      });
      const listWaitingStudents = await axios.get('/auth/getUserById', {
        params: {
          listIds: response.data.result.waitingStudents
        }
      });
      setWaitingStudentList(listWaitingStudents.data)
      setStudentList(listStudents.data);
 

    

    // axios.post('auth/setWaitingStudents', studentData).then(() =>{
    //   console.log("setWaitingStudents successfully");
    // }).catch(() =>{
    //   console.log("setWaitingStudents failed");
    // })

  }
  const refuseStudent = (id) => {
    const studentData = {
      classID: selectedClass._id,
      studentID: id,
      acceptance: false,
    }
  }
  
  return (
    <div className="people-container">
      <div className="giao-vien">
        <div className="them-hoc-sinh">
          <div className="text">Giáo Viên</div>
          <div></div>
        </div>
        <div className="giao-vien-info">
          <img
            className="avatar"
            src={loginnedUserId.photoURL}
            alt="User Avatar"
          />
          <div className="name"> {loginnedUserId.username} </div>
        </div>
      </div>

      <div className="hoc-sinh">
        <div className="them-hoc-sinh">
          <div className="text">Học Sinh</div>
          <div>
            <a>{studentList.length} học sinh</a>
            {
              loginnedUserId.role === 'teacher' && <button
              onClick={handleOpenModal}
              style={{
                color: "rgb(25,103,210)",
                backgroundColor: "white",
                fontSize: "20px",
              }}
            >
              <FontAwesomeIcon icon={faUserPlus} />
            </button>
            }
            
            {isModalOpen && <InviteModal onClose={handleCloseModal} />}
          </div>
        </div>
        {waitingStudentList &&
          waitingStudentList.map((student) => (
            <div
              className="hoc-sinh-list"
              key={student._id}
              style={{ position: "relative" }}
            >
              <img
                className="avatar"
                src={student.photoURL}
                alt="User Avatar"
              />
              <div className="name"> {student.username}</div>
              <div style={{ position: "absolute", top: "1", right: "0" }}>
                <div className="button-container">
                  <button className="accept-button" onClick={() => accpectStudent(student._id)}>Chấp Nhận</button>
                  <button className="deny-button" onClick={() => refuseStudent(student._id)}>Từ Chối</button>
                </div>
              </div>
            </div>
          ))}

        {studentList &&
          studentList.map((student) => (
            <div className="hoc-sinh-list" key={student._id}>
              <img
                className="avatar"
                src={student.photoURL}
                alt="User Avatar"
              />
              <div className="name"> {student.username}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
