import React, { useState } from "react";
import "./studentGrade.css";
import { useApp } from "../../../../context/AppProvider";
import pdf from "../../../../asset/pdf.png";
import word from "../../../../asset/word.png";
import checklist from "../../../../asset/checklist.png";
import { red } from "@mui/material/colors";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
export default function StudentGrade() {
  const {
    studentList,
    allAssignmentById,
    submittedAssignmentsByStudentId,
    findPerson,
    files,
  } = useApp();
  const [selectedStudent, setSelectedStudent] = useState({});
  const [openTheStudent, setOpenTheStudent] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState([]);
  const [sumGrade, setSumGrade] = useState(0);
  const handleSelectedStudent = (student) => {
    setSelectedStudent(student);
    const submittedAssignmentOfStudent = submittedAssignmentsByStudentId(
      student._id
    );
    setSelectedAssignment(submittedAssignmentOfStudent)

    const total = submittedAssignmentOfStudent?.reduce(
      (accumulator, currentAssignment) => {
        // Convert the grade string to a number using parseInt or parseFloat
        const gradeNumber = parseInt(currentAssignment.grade); // or parseFloat(currentAssignment.grade)
        // Add the grade number to the accumulator
        return accumulator + gradeNumber;
      },
      0
    );
    const average = Math.floor(total / allAssignmentById.length);
    console.log(average);
    setSumGrade(average);
    setOpenTheStudent(!openTheStudent);
  };
  const getFileInfo = (fileID) => {
    try {
      const thisFile = files.find((file) => file._id === fileID);
      const filename = thisFile.originalName;
      const path = thisFile.path;
      return { filename, path };
    } catch (error) {
      console.log("Cannot get Files", error);
    }
  };
  const items = allAssignmentById.slice().reverse();
  const [activeIndex, setActiveIndex] = useState(null);
  const onTitleClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  const renderItems = items.map((item, index) => {
    const isActive = index === activeIndex;
    const itemClassName = `accordion-item ${isActive ? "active" : ""}`;

    return (
      <div key={index} className={itemClassName}>
        <div className="accordion-title" onClick={() => onTitleClick(index)}>
          <div className="assignment-title">
            <div className="title-checklist">
              <img src={checklist} alt="" className="checklist-icon" />
              <div style={{ marginLeft: "10px" }}>{item.title}</div>
            </div>

            <div className="this-date">
              {/* <div style={{ marginRight: "10px" }}>
                {" "}
                Đã đăng vào ngày {formatDate(item.createdAt)}
              </div> */}
              {
                selectedAssignment[index]?.grade &&
                <div>{selectedAssignment[index].grade}/100</div>
              }
                {
                !selectedAssignment[index]?.grade &&
                <div style={{color: "red"}}> Thiếu</div>
              }
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                }}
              >
                {/* {loginnedUserId.role === "teacher" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Stop event propagation
                      toggleOptions(item._id);
                    }}
                    className="icon-button"
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>
                )} */}

                {/* {showOptionsId === item._id && (
                  <div className="assignment-options-menu">
                    <ul className="assignment-menu-list">
                      <li>
                        <button
                          onClick={() => editAssignment(item)}
                          className="assignment-menu-option"
                        >
                          Chỉnh sửa
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => deleteAssignmentById(item._id)}
                          className="menu-option"
                        >
                          Xoá
                        </button>
                      </li>
                    </ul>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
        {isActive && (
          <div className="content">
            <div />
            <div className="notification-text">
              <p
                className="user-content"
                style={{ marginLeft: "10px", textAlign: "start" }}
                dangerouslySetInnerHTML={{
                  __html: item.content,
                }}
              ></p>
            </div>

            <div className="file-content">
              {item.files.map((fileID, index) => {
                const fileInfo = getFileInfo(fileID);
                if (fileInfo) {
                  const { filename, path } = fileInfo;
                  const isPdf = filename.toLowerCase().endsWith(".pdf");
                  const isDocx = filename.toLowerCase().endsWith(".docx");
                  const isImage = filename.toLowerCase().endsWith(".png");

                  // Choose the appropriate image based on the file extension
                  const iconSrc = isPdf
                    ? pdf
                    : isDocx
                    ? word
                    : isImage
                    ? path
                    : null;
                  return (
                    <div className="file-container" key={fileID}>
                      <div className="files">
                        <a
                          href={path}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={index}
                        >
                          <div className="file-content-inside">
                            <img
                              src={iconSrc}
                              alt={isPdf ? "PDF" : isDocx ? "DOCX" : "File"}
                              className="file-icon"
                            />
                            <span className="filename">{filename}</span>
                          </div>
                        </a>
                      </div>
                    </div>
                  );
                }
                return null; // or handle the case when fileInfo is not available
              })}
            </div>
            {/* {loginnedUserId.role === "student" && (
              <button
                className="assignment-common-button"
                style={{ color: "#1a73e8" }}
                onClick={() => showIntruction(item)}
              >
                Xem Hướng Dẫn
              </button>
            )} */}
          </div>
        )}
      </div>
    );
  });
  return (
    <div className="StudentGrade" style={{position: "relative"}}>
      {
        openTheStudent && <ArrowBackIcon style={{color: "black", position: "absolute", top: "40", left: "50"}} onClick={()=> setOpenTheStudent(false)}/>
      }
        
      {openTheStudent && (
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "start",
          }}
        >
          <div
            style={{
              display: "flex",

              //   alignItems: "center",
              width: "70%",
              flexDirection: "column",
            }}
          >
            {/* ten voiw mat */}
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "20px",
              }}
            >
              <img
                className="avatar"
                src={selectedStudent.photoURL}
                alt="User Avatar"
                style={{ width: "80px", height: "80px" }}
              />
              <div className="name" style={{ fontSize: "20px" }}>
                {" "}
                {selectedStudent.username}
              </div>
            </div>
              {/* text */}
            <div>
              <div
                style={{ display: "flex", margin: "5px", fontWeight: "bold" }}
              >
                Đã hoàn thành{" "}
                {submittedAssignmentsByStudentId(selectedStudent._id).length}/
                {allAssignmentById.length} bài tập
              </div>
              <div
                style={{ display: "flex", margin: "5px", fontWeight: "bold" }}
              >
                Tổng điểm {sumGrade}/100
              </div>
            </div>
            </div>

            <div className="accordion" style={{margin: "20px 10px"}}>{renderItems}</div>
          </div>
        </div>
      )}
      {!openTheStudent && (
        <div className="hoc-sinh">
          <div style={{ margin: "15px", fontSize: "20px", fontWeight: "bold" }}>
            Tất cả học sinh
          </div>
          {studentList &&
            studentList.map((student) => (
              <div
                className="hoc-sinh-list"
                key={student._id}
                style={{ justifyContent: "space-between", margin: "10px" }}
                onClick={() => handleSelectedStudent(student)}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    className="avatar"
                    src={student.photoURL}
                    alt="User Avatar"
                  />
                  <div className="name"> {student.username}</div>
                </div>
                <div>
                  Đã hoàn thành{" "}
                  {submittedAssignmentsByStudentId(student._id).length}/
                  {allAssignmentById.length} bài tập
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
