import React, { useEffect, useState } from "react";
import "../assigmentDetail/assignmentDetail.css";
import { useApp } from "../../../context/AppProvider";
import pdf from "../../../asset/pdf.png";
import word from "../../../asset/word.png";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import axios from "../../../services/axios";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
export default function AssignmentDetail({ assignmentDetail }) {
  const [privateComment, setPrivateComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const {
    findPerson,
    selectedClass,
    files,
    loginnedUserId,
    findSubmittedAssignmentByStudentId,
    handleChilderRender,
    
    
  } = useApp();
  const [allText, setAllText] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [thisSubmittedAssignmentFiles, setThisSubmittedAssignmentFiles] = useState([]);




  var thisSubmittedAssignment =
    findSubmittedAssignmentByStudentId(
      assignmentDetail._id,
      loginnedUserId._id
    ) || null;
    useEffect(() =>{
      setThisSubmittedAssignmentFiles(thisSubmittedAssignment.submissionFiles);
    },[thisSubmittedAssignment.submissionFiles])
    
  const formatDate = (timestamp) => {
    const options = { month: "numeric", day: "numeric", year: "numeric" };
    return new Date(timestamp).toLocaleDateString("en-US", options);
  };
  // const formatDueDate = (timestamp) => {
  //   // console.log(timestamp);
  //   const dueDay = new Date(timestamp);

  //   // Extract day, month, year, hours, and minutes from the date
  //   const day = dueDay.getDate();
  //   const month = dueDay.getMonth() + 1; // Note: Month is zero-based, so we add 1
  //   const year = dueDay.getFullYear();
  //   const hours = dueDay.getHours();
  //   const minutes = dueDay.getMinutes();
  //   // Format the date components into a string
  //   const formattedDate = `${day < 10 ? "0" + day : day}/${
  //     month < 10 ? "0" + month : month
  //   }/${year} ${hours < 10 ? "0" + hours : hours}:${
  //     minutes < 10 ? "0" + minutes : minutes
  //   }`;
  //   return formattedDate;
  // };
  const formatDueDate = (timestamp) => {
    const [datePart, timePart] = timestamp.split("T");
    const editSelectedDate = datePart; // selectedDate will be '2024-05-21'
    const editSelectedTime = timePart.substring(0, 5); // selectedTime will be '05:29'
    const thisDate = editSelectedDate + " " + editSelectedTime;
    return thisDate;
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

  const handlePrivateCommentChange = (e) => {
    setPrivateComment(e.target.value);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;

    const filesArray = Array.from(files);
    console.log( "upload files",filesArray);
    if (selectedFiles.length === 0) {
      setSelectedFiles(filesArray);
    } else {
      setSelectedFiles(selectedFiles.concat(filesArray));
    }

    // const fileNames = Array.from(files).map((file) => file.name);
    // setSelectedFilesName(fileNames);
  };
  function truncateString(str, length) {
    if (str.length > length) {
      return str.substring(0, length) + "...";
    } else {
      return str;
    }
  }

  const deleteFile = async (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const deleteAssignmentFile = async (fileID) => {
    console.log("Deleting file with ID:", fileID); 
    setThisSubmittedAssignmentFiles(thisSubmittedAssignmentFiles.filter((id) => id !== fileID));
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

  const handleAssignmentSubmission = async () => {
    if(isEdit && selectedFiles.length <= 0 && thisSubmittedAssignmentFiles.length !== thisSubmittedAssignment.submissionFiles.length){

      const newFormData = {
        id: thisSubmittedAssignment,
        submissionFiles: thisSubmittedAssignmentFiles
      }
      await axios.put('submittedAssignment/updateStudentSubmittedAssignmentById', newFormData);
      // alert('nop lai bai thanh cong')
      setSelectedFiles([]);
      handleChilderRender();
      setEdit(false)
      return ;
    }

    if (selectedFiles.length <= 0) {
      alert("Vui lòng thêm file dữ liệu để nộp bài");
      return;
    }
    try {
      let uploadedFileIds = [...existingFiles]; // Start with existing files

      if (selectedFiles.length > 0) {
        const formData = new FormData();
        for (const file of selectedFiles) {
          formData.append("pdf", file);
        }

        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const Originalname = await response.data.Originalname;
        const path = await response.data.pdfUrls;

        for (const [index, name] of Originalname.entries()) {
          const filesData = {
            originalName: name,
            path: path[index],
          };
          const uploadedFiles = await axios.post("api/createFiles", filesData);
          // if(assignmentDetail.files.length > 0){
          //   uploadedFileIds.push(assignmentDetail.files)
          // }
          // if(thisSubmittedAssignmentFiles.length >0){
          //   for (const file of thisSubmittedAssignmentFiles) {
          //     uploadedFileIds.push(file._id)
          //   }
          //   uploadedFileIds.push(thisSubmittedAssignmentFiles) 
          // }

          uploadedFileIds.push(uploadedFiles.data._id);
          if(isEdit){
            thisSubmittedAssignmentFiles.forEach((element) => {
              uploadedFileIds.push(element);
            });
            const newFormData = {
              id: thisSubmittedAssignment,
              submissionFiles: uploadedFileIds
            }
            await axios.put('submittedAssignment/updateStudentSubmittedAssignmentById', newFormData);
            // alert('nop lai bai thanh cong')
            setSelectedFiles([]);
            handleChilderRender();
            setEdit(false)
            return ;
          }
          //   if (isEdit) {
          //     assignmentFiles.forEach((element) => {
          //       uploadedFileIds.push(element);
          //     });
        }
        // if(selectedFiles.length <= 0){ 
        //   uploadedFileIds = assignmentDetail.files;
        //   // thinh
        // }
        const assignmentData = {
          assignmentID: assignmentDetail._id,
          studentID: loginnedUserId._id,
          submissionFiles: uploadedFileIds,
          classID: selectedClass._id,
        };
        const currentTime = new Date();
        console.log("currentTime", currentTime);
        console.log("assignmentDetail.dueDay", assignmentDetail.dueDay);
        const dueDay = new Date(assignmentDetail.dueDay);
        const thisDueDay = +dueDay;
        if (thisDueDay > currentTime) {
          // Nếu dueDay đã qua, đặt lateState là true
          assignmentData.isLateSubmission = false;
        } else {
          assignmentData.isLateSubmission = true;
          if (assignmentDetail.submitLatePermission) {
            return alert("Bạn không thể nộp bài sau thời gian đến hạn");
          }
        }
        if (allText) {
          assignmentData.privateComment = allText;
        }
        console.log(assignmentData);
        axios
          .post("submittedAssignment/createSubmittedAssignment", assignmentData)
          .then((response) => {
            console.log("nop bai tap thanh cong", assignmentData);
          })
          .catch((error) => {
            console.error("nop bai tap khong thanh cong", error);
          });
        handleChilderRender();
        setPrivateComment("");
        setSelectedFiles([]);
        setAllText([]);
      }
    } catch (error) {
      console.log("Khong the luu bai tap");
    }
  };

  return (
    <div className="AssignmentDetail-container">
      <div className="AssignmentDetail-allComponent">
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
            <div>{assignmentDetail.grade} điểm</div>
            <div>Đến hạn {formatDueDate(assignmentDetail.dueDay)}</div>
          </div>
          <div className="AssignmentDetail-text">
            <p
              className="user-content"
              style={{ textAlign: "start" }}
              dangerouslySetInnerHTML={{
                __html: assignmentDetail.content,
              }}
            ></p>
          </div>
          <div className="file-content">
            {assignmentDetail.files.map((fileID, index) => {
              const fileInfo = getFileInfo(fileID);
              if (fileInfo) {
                const { filename, path } = fileInfo;
                const isPdf = filename.toLowerCase().endsWith(".pdf");
                const isDocx = filename.toLowerCase().endsWith(".docx");
                const isImage = filename.toLowerCase().endsWith(".png");
                // truncateString(filename, 1)
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
              <div>Bài Tập Của Bạn</div>
              {thisSubmittedAssignmentFiles && <div>Đã Nộp</div>}
              {!thisSubmittedAssignmentFiles && <div>Chưa Nộp</div>}
            </div>
            <div>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="custom-file-input"
                id="customFile" // Make sure this matches the label's "for" attribute
              />
              {/* { const t = findSubmittedAssignment(assignmentDetail._id) && <div>{findSubmittedAssignment(assignmentDetail._id)._id}</div>} */}
              {selectedFiles.length > 0 && (
                <div className="file-content">
                  {selectedFiles?.map((fileID, index) => {
                    // const fileInfo = getFileInfo(fileID);
                    if (fileID) {
                      const filename = fileID.name;
                      const isPdf = filename.toLowerCase().endsWith(".pdf");
                      const isDocx = filename.toLowerCase().endsWith(".docx");
                      const isImage =
                        filename.toLowerCase().endsWith(".png") ||
                        filename.toLowerCase().endsWith(".jpg");
                      // filename = truncateString(filename, 15)
                      // Choose the appropriate image based on the file extension
                      const iconSrc = isPdf ? pdf : isDocx ? word : isImage;
                      return (
                        <div
                          className="file-container"
                          key={fileID.lastModified}
                        >
                          <div className="files">
                            <div className="file-content-inside">
                              <img
                                src={iconSrc}
                                alt={isPdf ? "PDF" : isDocx ? "DOCX" : "File"}
                                className="file-icon"
                              />
                              <span className="filename">
                                {truncateString(filename, 15)}
                              </span>
                              <ClearIcon
                                className="clear-file-icon"
                                onClick={() => deleteFile(index)}
                              />
                            </div>
                          </div>
                          
                        </div>
                      );
                    }
                    return null; // or handle the case when fileInfo is not available
                  })}
                </div>
              )}

              {/* findSubmittedAssignment(assignmentDetail._id).submissionFiles */}
              {thisSubmittedAssignmentFiles && (
                <div className="file-content">
                  {thisSubmittedAssignmentFiles?.map(
                    (fileID, index) => {
                      const fileInfo = getFileInfo(fileID);
                      if (fileInfo) {
                        const { filename, path } = fileInfo;
                        const isPdf = filename.toLowerCase().endsWith(".pdf");
                        const isDocx = filename.toLowerCase().endsWith(".docx");
                        const isImage = filename.toLowerCase().endsWith(".png");
                        // truncateString(filename, 1)
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
                                    alt={
                                      isPdf ? "PDF" : isDocx ? "DOCX" : "File"
                                    }
                                    className="file-icon"
                                  />
                                  <span className="filename">
                                    {truncateString(filename, 15)}
                                  </span>
                                </div>
                              </a>
                            </div>
                            {
                              isEdit && <HighlightOffIcon className="highlightIcon" onClick={() => deleteAssignmentFile(fileID)}/>
                            }
                          
                                      {/* thinh */}
                          </div>
                        );
                      }
                      return null; // or handle the case when fileInfo is not available
                    }
                  )}
                </div>
              )}
              {/* thinh setEdit*/}
              {
                !isEdit && thisSubmittedAssignmentFiles && (
                  <div>
                    {" "}
                    <button
                      className="add-Submission"
                      onClick={() =>
                        setEdit(true)
                      }
                    >
                      Chỉnh Sửa
                    </button>
                  </div>
                )
              }

              {thisSubmittedAssignmentFiles && isEdit && (
                <div>
                  {" "}
                  <button
                    className="add-Submission"
                    onClick={() =>
                      document.getElementById("customFile").click()
                    }
                  >
                   + Thêm hoặc tạo
                  </button>
                </div>
              )}

              {!thisSubmittedAssignmentFiles && (
                <div>
                  {" "}
                  <button
                    className="add-Submission"
                    onClick={() =>
                      document.getElementById("customFile").click()
                    }
                  >
                    + Thêm hoặc tạo
                  </button>
                </div>
              )}
              {/* {!selectedFiles.length > 0 && (
                <button className="mark-Submission">
                  {" "}
                  Đánh dấu là đã hoàn thành
                </button>
              )} */}
              {selectedFiles.length > 0 && !isEdit  &&(
                <button
                  className="mark-Submission"
                  style={{ color: "white", backgroundColor: "blue" }}
                  onClick={handleAssignmentSubmission}
                >
                  {/* {!isEdit && "Nộp Bài"}
                  {isEdit && "Nộp Lại"} */}
                  Nộp Bài
                </button>
              )}
              {isEdit && (selectedFiles.length > 0 || (thisSubmittedAssignmentFiles.length !== thisSubmittedAssignment.submissionFiles.length && thisSubmittedAssignmentFiles.length >0) )  &&(
                <button
                  className="mark-Submission"
                  style={{ color: "white", backgroundColor: "blue" }}
                  onClick={handleAssignmentSubmission}
                >
                  {/* {!isEdit && "Nộp Bài"}
                  {isEdit && "Nộp Lại"} */}
                  Nộp Lại
                </button>
              )}
            </div>
          </div>
          <div className="AssignmentDetail-comment">
            <div style={{ display: "flex", alignItems: "center" }}>
              {" "}
              <PersonOutlineIcon /> Nhận xét riêng tư
            </div>
            {/* thinh privateComment */}
            {
              thisSubmittedAssignment && (
                <div className="user-info" style={{ margin: "10px" }}>
                  <img
                    className="avatar"
                    src={loginnedUserId.photoURL}
                    alt="User Avatar"
                  />
                  <div className="nameAndTime">
                    <a className="username">{loginnedUserId.username}</a>
                    {/* <a>{formatDate(notification.createdAt)}</a> */}
                  </div>
                </div>
              )
            }
            {
              thisSubmittedAssignment?.privateComment?.map((text, index) => (
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
              {/* {thinh} */}
            {thisSubmittedAssignment?.teacherResponses?.length > 0 && (
              <div className="user-info" style={{ margin: "10px" }}>
                <img
                  className="avatar"
                  src={findPerson(selectedClass.teacherID).photoURL}
                  alt="User Avatar"
                />
                <div className="nameAndTime">
                  <a className="username">
                    {findPerson(selectedClass.teacherID).username}
                  </a>
                  {/* <a>{formatDate(notification.createdAt)}</a> */}
                </div>
              </div>
            )}
            {thisSubmittedAssignment?.teacherResponses &&
              thisSubmittedAssignment?.teacherResponses.map((text, index) => (
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
            
            {allText.length > 0 && (
              <div className="user-info" style={{ margin: "10px" }}>
                <img
                  className="avatar"
                  src={loginnedUserId.photoURL}
                  alt="User Avatar"
                />
                <div className="nameAndTime">
                  <a className="username">{loginnedUserId.username}</a>
                  {/* <a>{formatDate(notification.createdAt)}</a> */}
                </div>
              </div>
            )}
            {allText &&
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
                label="Thêm nhận xét riêng tư..."
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
