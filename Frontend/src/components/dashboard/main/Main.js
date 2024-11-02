import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "../../../context/AppProvider";
import MyQuill from "./MyQuillEditor";
import "./main.css";
import axios from "../../../services/axios";
import pdf from "../../../asset/pdf.png";
import word from "../../../asset/word.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import EditNotificationModal from "../main/notificationModal/NotificationModal";
import CircularProgress from "@mui/material/CircularProgress";
import ClearIcon from "@mui/icons-material/Clear";
import { set } from "lodash";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SendIcon from "@mui/icons-material/Send";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BackspaceIcon from "@mui/icons-material/Backspace";
export default function Main({
  isOpen,
  onClose,
  notificationId,
  selectedIndex,
}) {
  const {
    selectedClass,
    notificationByClassId,
    loginnedUserId,
    files,
    setNotification,
    findPerson,
    loading,
    handleChilderRender,
  } = useApp();

  const [notification, setThisNotification] = useState(false);
  const [comment, setThisComment] = useState("");
  // const [isLoading, setLoading] = useState(false);
  // if(notificationByClassId.length === 0){
  //   setLoading(true)
  // }else{
  //   setLoading(false)
  // }

  // const thisNotificationByClassId = notificationByClassId;
  const [isHovered, setIsHovered] = useState(false); // thinh

  const handleOpenNoti = (e) => {
    setThisNotification(true);
  };

  const handleCloseNoti = (e) => {
    setThisNotification(false);
  };
  const handleCommentChange = (e) => {
    const comment = e.target.value;
    setThisComment(comment);
  };
  const deleteText = async (thisNotificationID, index) => {
    console.log(thisNotificationID);
    console.log(index);
    const commentFormData = {
      notificationId: thisNotificationID,
      commentIndex: index,
    };
    await axios
      .post(`notification/deleteComment`, commentFormData)
      .then(() => {
        console.log("deleteComment successfully");
      })
      .catch(() => {
        console.log("deleteComment failed");
      });
    handleChilderRender();
    // thinh
    // const updatedTexts = notification.comments;
    // updatedTexts.splice(index, 1);
    // console.log(updatedTexts);

    // setThisComment(updatedTexts);
  };
  const postComment = async (notificationId) => {
    // console.log(loginnedUserId._id);
    // console.log(notificationId);
    // console.log(comment);
    if (comment.trim() === "") {
      return;
    }
    const commentFormData = {
      userID: loginnedUserId._id,
      comment: comment,
    };
    setThisComment("");
    await axios
      .post(`notification/addComment/${notificationId}`, commentFormData)
      .then(() => {
        console.log("commentFormData successfully");
      })
      .catch(() => {
        console.log("commentFormData failed");
      });
    handleChilderRender();
  };
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);

  const backgroundImages = [
    "https://gstatic.com/classroom/themes/img_backtoschool.jpg",
    "https://gstatic.com/classroom/themes/img_code.jpg",
    "https://gstatic.com/classroom/themes/Honors.jpg",
    "https://gstatic.com/classroom/themes/img_learnlanguage.jpg",
    "https://gstatic.com/classroom/themes/img_bookclub.jpg",
  ];

  // const formatDate = (timestamp) => {
  //   const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
  //   return new Date(timestamp).toLocaleString('en-US', options);
  // };
  const formatDate = (timestamp) => {
    const options = { month: "numeric", day: "numeric", year: "numeric" };
    return new Date(timestamp).toLocaleDateString("en-US", options);
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
  const [showOptions, setShowOptions] = useState(false);
  const [showOptionsId, setShowOptionsId] = useState(null);

  // setApiPath('notification/createNotification')

  // This function toggles the visibility of the options
  const toggleOptions = (notificationId) => {
    setShowOptionsId((currentShowOptionsId) =>
      currentShowOptionsId === notificationId ? null : notificationId
    );
    setShowOptions(!showOptions);
  };

  const handleEditClick = (notificationId) => {
    setSelectedNotificationId(notificationId);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const editNotificationById = (notificationId) => {
    console.log(`Editing notification with ID: ${notificationId}`);
    setSelectedNotificationId(notificationId);
    setEditModalOpen(true);
  };

  const deleteNotificationById = async (notificationId) => {
    console.log(`Deleting notification with ID: ${notificationId}`);
    await axios.post(`notification/deleteNotification/${notificationId}`);
    setNotification((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification._id !== notificationId
      )
    );

    // window.location.reload();
    // setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  };
  const meetLink = 'https://meet.google.com/?authuser=0';
  const openMeet = () => {
    // Open the Google Meet link in a new tab
    window.open(meetLink, '_blank');
  };

  return (
    <div className="container"  >
      <div className="main-dashboard">
        <div
          className="head-content"
          style={{
            backgroundImage: `url(${
              backgroundImages[selectedIndex % backgroundImages.length]
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div>{selectedClass.className}</div>
          <div>{selectedClass.description}</div>
        </div>

        <div className="notification-classCode">
          <div className="classCode-classChat">
            <div className="classCode-container">
              <div>
                Mã lớp
                <div className="classCode"> {selectedClass.classCode}</div>
              </div>
            </div>

            {/* <div className="classChat-container">Nhóm Chat</div> */}
            <button onClick={openMeet}>Open Google Meet</button>
          </div>

          <div className="notification-content">
            {loginnedUserId.role === "teacher" && (
              <div className="create-Notification">
                <div
                  className="create-Notification-info"
                  onClick={handleOpenNoti}
                >
                  {!notification && (
                    <>
                      <img
                        className="avatar"
                        src={loginnedUserId.photoURL}
                        alt="User Avatar"
                      />
                      <div className="notification">
                        Thông báo nội dung nào đó cho lớp của bạn
                      </div>
                    </>
                  )}
                </div>
                {notification && (
                  <div>
                    <MyQuill onClose={handleCloseNoti} />
                  </div>
                )}
              </div>
            )}

            <div className="notification-box">
              {loading === true && <CircularProgress />}
              {/* {!notificationByClassId && <div  style={{color: "red"}}>Giáo Viên Hiện Tại Chưa Đăng Thông Báo</div>} */}
              {notificationByClassId
                .slice()
                .reverse()
                .map((notification) => (
                  <div key={notification._id} className="notification-card">
                    <div className="notification-content-inside">
                      <div className="user-info">
                        {loginnedUserId.role === "teacher" && (
                          <img
                            className="avatar"
                            src={loginnedUserId.photoURL}
                            alt="User Avatar"
                          />
                        )}
                        {loginnedUserId.role === "student" && (
                          <img
                            className="avatar"
                            src={findPerson(selectedClass.teacherID).photoURL}
                            alt="User Avatar"
                          />
                        )}
                        <div className="header-notification">
                          <div className="nameAndTime">
                            {loginnedUserId.role === "teacher" && (
                              <a className="username">
                                {loginnedUserId.username}
                              </a>
                            )}
                            {loginnedUserId.role === "student" && (
                              <a className="username">
                                {findPerson(selectedClass.teacherID).username}
                              </a>
                            )}

                            <a>{formatDate(notification.createdAt)}</a>
                          </div>

                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            {loginnedUserId.role === "teacher" && (
                              <button
                                onClick={() => toggleOptions(notification._id)}
                                className="icon-button"
                              >
                                <FontAwesomeIcon icon={faEllipsisV} />
                              </button>
                            )}

                            {showOptionsId === notification._id && (
                              <div className="options-menu">
                                <ul className="menu-list">
                                  <li>
                                    <button
                                      onClick={() =>
                                        editNotificationById(showOptionsId)
                                      }
                                      className="menu-option"
                                    >
                                      Edit
                                    </button>
                                  </li>
                                  {selectedNotificationId && (
                                    <EditNotificationModal
                                      isOpen={isEditModalOpen}
                                      notificationId={selectedNotificationId}
                                      onClose={handleEditModalClose}
                                    />
                                  )}
                                  <li>
                                    <button
                                      onClick={() =>
                                        deleteNotificationById(showOptionsId)
                                      }
                                      className="menu-option"
                                    >
                                      Delete
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="content">
                        <div />
                        <div className="notification-text">
                          <p
                            className="user-content"
                            style={{ textAlign: "flex-start" }}
                            // thinh flex: start
                            dangerouslySetInnerHTML={{
                              __html: notification.content,
                            }}
                          ></p>
                        </div>

                        <div className="file-content">
                          {notification.files.map((fileID, index) => {
                            const fileInfo = getFileInfo(fileID);
                            if (fileInfo) {
                              const { filename, path } = fileInfo;
                              const isPdf = filename
                                .toLowerCase()
                                .endsWith(".pdf");
                              const isDocx = filename
                                .toLowerCase()
                                .endsWith(".docx");
                              const isImage =
                                filename.toLowerCase().endsWith(".png") ||
                                filename.toLowerCase().endsWith(".jpg");

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
                                          isPdf
                                            ? "PDF"
                                            : isDocx
                                            ? "DOCX"
                                            : "File"
                                        }
                                        className="file-icon"
                                      />
                                      <span className="filename">
                                        {filename}
                                      </span>
                                    </div>
                                  </a>
                                </div>
                              );
                            }
                            return null; // or handle the case when fileInfo is not available
                          })}
                        </div>
                      </div>

                      <div
                        style={{
                          color: "black",
                          display: "flex",
                          alignItems: "center",
                          margin: "5px",
                        }}
                      >
                        <PersonOutlineIcon />
                        Nhận xét trong lớp học
                      </div>
                      {notification.comments &&
                        notification.comments.map((item, index) => (
                          <div key={index}>
                            <div
                              className="user-info"
                              style={{ margin: "10px" }}
                              onMouseEnter={() => setIsHovered(true)} // Handle mouse enter event
                              onMouseLeave={() => setIsHovered(false)} // Handle mouse leave event
                            >
                              <img
                                className="avatar"
                                src={findPerson(item.userID).photoURL}
                                alt="User Avatar"
                              />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <div className="nameAndTime">
                                  <a
                                    className="username"
                                    style={{ display: "flex" }}
                                  >
                                    {findPerson(item.userID).username}
                                  </a>
                                </div>
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      color: "black",
                                      margin: "2px 10px",
                                      // marginLeft: "10px",

                                      maxWidth: "250px",
                                      height: "30px",
                                      overflow: "scroll",
                                    }}
                                  >
                                    {item.comment}
                                  </div>
                                </div>
                              </div>
                              {isHovered &&
                                item.userID === loginnedUserId._id && (
                                  
                                  <ClearIcon
                                    className="clear-icon"
                                    style={{
                                      margin: "10px",
                                      marginLeft: "20px",
                                      color: "black",
                                    }}
                                    onClick={() =>
                                      deleteText(notification._id, index)
                                    }
                                  />
                                  // <div style={{margin: "10px",marginLeft:"20px",color:"#bebbbb"}}>Xoá</div>
                                )}
                            </div>
                          </div>
                        ))}
                      <div style={{ display: "flex" }}>
                        {loginnedUserId.role === "student" && <></>}
                        <div
                          style={{
                            border: "solid 1px #f0f0f0",
                            padding: "10px",
                            borderRadius: "20px",
                          }}
                        >
                          <TextField
                            id="input-with-icon-textfield"
                            label="Thêm nhận xét trong lớp học..."
                            style={{ width: "600px", height: "50px" }}
                            onChange={handleCommentChange}
                            value={comment}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AccountCircle />
                                </InputAdornment>
                              ),
                            }}
                            variant="standard"
                          />
                        </div>
                        <div
                          className="this-send-icon"
                          disabled={
                            !comment.trim() ||
                            !comment.replace(/<\/?[^>]+(>|$)/g, "").trim()
                          }
                        >
                          {" "}
                          <SendIcon
                            onClick={() => postComment(notification._id)}
                          />
                        </div>
                      </div>
                      <div>
                        {/* {notification.comments && (
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
    
                            </div>
                          </div>
                        )} */}
                        {/* <ClearIcon
                    className="clear-icon"
                    onClick={() => deleteText(index)}
                  /> */}
                        {/* <a>{formatDate(notification.createdAt)}</a> */}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
