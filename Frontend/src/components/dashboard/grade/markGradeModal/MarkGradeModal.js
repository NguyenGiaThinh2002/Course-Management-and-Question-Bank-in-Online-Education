import React, { useState } from "react";
import { useApp } from "../../../../context/AppProvider";
import pdf from "../../../../asset/pdf.png";
import word from "../../../../asset/word.png";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import axios from "../../../../services/axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import "./markGradeModal.css";

export default function MarkGradeModal({ submittedAssignment , onClose}) {
  const [privateComment, setPrivateComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { findPerson, selectedClass, files, loginnedUserId, findAssignment, handleChilderRender } =
    useApp();
  const [allText, setAllText] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [grade, setGrade] = useState(0);
  var assignmentDetail = findAssignment(submittedAssignment.assignmentID);
  const formatDate = (timestamp) => {
    const options = { month: "numeric", day: "numeric", year: "numeric" };
    return new Date(timestamp).toLocaleDateString("en-US", options);
  };
  
  const formatDueDate = (timestamp) => {
    // console.log(timestamp);
    // const dueDay = new Date(timestamp);

    // // Extract day, month, year, hours, and minutes from the date
    // const day = dueDay.getDate();
    // const month = dueDay.getMonth() + 1; // Note: Month is zero-based, so we add 1
    // const year = dueDay.getFullYear();
    // const hours = dueDay.getHours();
    // const minutes = dueDay.getMinutes();
    // // Format the date components into a string
    // const formattedDate = `${day < 10 ? "0" + day : day}/${
    //   month < 10 ? "0" + month : month
    // }/${year} ${hours < 10 ? "0" + hours : hours}:${
    //   minutes < 10 ? "0" + minutes : minutes
    // }`;
    // return formattedDate;
    const [datePart, timePart] = timestamp.split('T');
    const editSelectedDate = datePart; // selectedDate will be '2024-05-21'
    const editSelectedTime = timePart.substring(0, 5); // selectedTime will be '05:29'
    const thisDate = editSelectedDate + " " + editSelectedTime;
    return thisDate;
  };
  function truncateString(str, length) {
    if (str.length > length) {
      return str.substring(0, length) + "...";
    } else {
      return str;
    }
  }
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

  const handlePrivateCommentChange = (e) => {
    setPrivateComment(e.target.value);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;

    const filesArray = Array.from(files);
    console.log(filesArray);
    if (selectedFiles.length === 0) {
      setSelectedFiles(filesArray);
    } else {
      setSelectedFiles(selectedFiles.concat(filesArray));
    }

    // const fileNames = Array.from(files).map((file) => file.name);
    // setSelectedFilesName(fileNames);
  };
  const deleteFile = async (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const saveOneText = () => {
    allText.push(privateComment);
    setPrivateComment("");
    // const textTime = new Date();
    // console.log(textTime);
    // console.log(allText);
  };
  const deleteText = async (index) => {
    const updatedTexts = [...allText];
    updatedTexts.splice(index, 1);
    setAllText(updatedTexts);
  };

  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };

  const handleAssignmentSubmission = async (thisid) => {
      if(!grade){
        alert("Vui lòng nhập điểm")
        return;
      }else if(grade < 0 || grade > 100){
        alert("Vui lòng nhập điểm hợp lệ")
        return;
      }
      const newSubmittedAssignment = {
        id: thisid,
        grade: grade,
        teacherResponses: allText
      }
      console.log(grade);
      console.log(allText);
      console.log(thisid);
      axios.put('submittedAssignment/updateSubmittedAssignmentById', newSubmittedAssignment).then((response) => {
        console.log("cap nhat thanh cong");
        alert("Đã hoàn thành việc chấm điểm")
        onClose()
        handleChilderRender()
      }).catch((error) => {
        console.log("cap nhat khong thanh cong");
      })
  };

  return (
    <div className="AssignmentDetail-container">
      <div className="AssignmentDetail-allComponent" style={{position: "relative"}}>
        <ArrowBackIcon style={{color: "black", position: "absolute", top: "0", left: "40"}} onClick={()=>onClose()}/>
        <div className="AssignmentDetail-content">
          <div className="assignmentTitle">{assignmentDetail.title}</div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "15px",
            }}
          >
            <div>{findPerson(selectedClass.teacherID).username} -- </div>
            <div>- {formatDate(assignmentDetail.createdAt)}</div>
          </div>
          <div className="gradeAndDueday">
            <div>{submittedAssignment.grade}/100 điểm</div>
            <div>Đến hạn {formatDueDate(assignmentDetail.dueDay)}</div>
          </div>
          <div className="AssignmentDetail-text" style={{position: "relative"}}>
            <p
              className="user-content"
              style={{ textAlign: "start" }}
              dangerouslySetInnerHTML={{
                __html: assignmentDetail.content,
              }}
            >
            </p>
            <div style={{fontWeight: "bold" , marginTop: "5px",  position: "absolute", top: "0", right: "0"}} >Nộp Vào Lúc: {formatDueDate(submittedAssignment.submissionDate)}</div>
          </div>
          <div className="file-content">
            {assignmentDetail.files.map((fileID, index) => {
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
        </div>
        <div className="AssignmentDetail-commit-comment">
          <div className="AssignmentDetail-commit">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "5px",
              }}
            >
              
              <div>Bài Tập Đã Nộp</div>
              {submittedAssignment.isLateSubmission === true && (
                <div
                  style={{
                    color: "red",

                    alignSelf: "flex-end",
                  }}
                >
                  Nộp Trễ Hạn
                </div>
              )}
              {submittedAssignment.isLateSubmission === false && (
                <div
                  style={{
                    color: "green",

                    alignSelf: "flex-end",
                  }}
                >
                  Nộp Đúng Hạn
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="custom-file-input"
                id="customFile" // Make sure this matches the label's "for" attribute
              />
              {submittedAssignment.submissionFiles.length > 0 && (
                <div className="file-content">
                  {submittedAssignment.submissionFiles.map((fileID, index) => {
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
                                <span className="filename">{truncateString(filename, 15)}</span>
                              </div>
                            </a>
                          </div>
                        </div>
                      );
                    }
                    return null; // or handle the case when fileInfo is not available
                  })}
                </div>
              )}
              {/* <button
                className="add-Submission"
                onClick={() => document.getElementById("customFile").click()}
              >
                + Thêm hoặc tạo
              </button>
              {!selectedFiles.length > 0 && (
                <button className="mark-Submission">
                  {" "}
                  Đánh dấu là đã hoàn thành
                </button>
              )} */}
              
              <div>
                <TextField
                  id="filled-number"
                  required
                  sx={{ m: 1, width: "250px" }}
                  label="Số điểm"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="filled"
                  className="diem-so"
                  onChange={handleGradeChange}
                  value={grade}
                />
              </div>

              <button
                className="mark-Submission"
                style={{ color: "white", backgroundColor: "blue" }}
                  onClick={() => handleAssignmentSubmission(submittedAssignment._id)}
              >
                  {
                    submittedAssignment.grade <= 0 &&<>Chấm Điểm</>
                  }
                  {
                    submittedAssignment.grade > 0 && <>Chấm Lại</>
                  }
              </button>
              
            </div>
          </div>
          <div className="AssignmentDetail-comment">
            <div style={{ display: "flex", alignItems: "center" }}>
              {" "}
              <PersonOutlineIcon /> Nhận xét riêng tư
            </div>
            {submittedAssignment.privateComment.length > 0 && (
              <div className="user-info" style={{ margin: "10px" }}>
                <img
                  className="avatar"
                  src={findPerson(submittedAssignment.studentID).photoURL}
                  alt="User Avatar"
                />
                <div className="nameAndTime">
                  <a className="username">
                    {findPerson(submittedAssignment.studentID).username}
                  </a>
                  {/* <a>{formatDate(notification.createdAt)}</a> */}
                </div>
              </div>
            )}
            {/* teacherResponses */}
            {submittedAssignment.privateComment &&
              submittedAssignment.privateComment.map((text, index) => (
                <div
                  key={index}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      margin: "10px",
                      maxWidth: "250px",
                      height: "30px",
                      overflow: "scroll",
                    }}
                  >
                    {text}
                  </div>
                </div>
              ))}
              {submittedAssignment.teacherResponses.length > 0 && (
              <div className="user-info" style={{ margin: "10px" }}>
                <img
                  className="avatar"
                  src={loginnedUserId.photoURL}
                  alt="User Avatar"
                />
                <div className="nameAndTime">
                  <a className="username">
                    {loginnedUserId.username}
                  </a>
                  {/* <a>{formatDate(notification.createdAt)}</a> */}
                </div>
              </div>
            )}
            {submittedAssignment.teacherResponses &&
              submittedAssignment.teacherResponses.map((text, index) => (
                <div
                  key={index}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      margin: "10px",
                      maxWidth: "250px",
                      height: "30px",
                      overflow: "scroll",
                    }}
                  >
                    {text}
                  </div>
                </div>
              ))}
            {/* teacherResponses */}

              {allText.length > 0 && (
              <div className="user-info" style={{ margin: "10px" }}>
                <img
                  className="avatar"
                  src={loginnedUserId.photoURL}
                  alt="User Avatar"
                />
                <div className="nameAndTime">
                  <a className="username">
                    {loginnedUserId.username}
                  </a>
                  {/* <a>{formatDate(notification.createdAt)}</a> */}
                </div>
              </div>
            )}
              {allText.length > 0 &&
              allText.map((text, index) => (
                <div
                  key={index}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      margin: "10px",
                      maxWidth: "250px",
                      height: "30px",
                      overflow: "scroll",
                    }}
                  >
                    {text}
                  </div>
                  <ClearIcon
                      className="clear-icon"
                      onClick={() => deleteText(index)}
                    />
                </div>
              ))}
            <div
              style={{
                margin: "5px",
                width: "270px",
                display: "flex",
                flexDirection: "space-between",
                alignItems: "center",
              }}
            >
              {" "}
              <TextField
                // required
                id="outlined-required"
                label="Trả lời nhận xét riêng tư..."
                defaultValue="Hello World"
                variant="filled"
                className="assignTitle"
                onChange={handlePrivateCommentChange}
                value={privateComment}
              />
              <div className="sendIcon">
                <SendIcon
                  style={{ marginLeft: "10px" }}
                  onClick={() => saveOneText()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
