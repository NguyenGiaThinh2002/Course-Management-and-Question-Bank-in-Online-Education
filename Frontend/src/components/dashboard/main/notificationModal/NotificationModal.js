import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "../../../../services/axios";
import pdfIcon from "../../../../asset/pdf.png";
import wordIcon from "../../../../asset/word.png";
import pdf from "../../../../asset/pdf.png";
import word from "../../../../asset/word.png";
import { useApp } from "../../../../context/AppProvider";
import "../notificationModal/NotificationModal.css";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import ClearIcon from "@mui/icons-material/Clear";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
Modal.setAppElement("#root");
const EditNotificationModal = ({ isOpen, onClose, notificationId }) => {
  const [content, setContent] = useState("");
  const { selectedClass, files, setNotification, handleChilderRender } =
    useApp();
  const [createdFiles, setCreatedFiles] = useState([]);
  const [pdfUrls, setPdfUrls] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);

  const [notificationFiles, setNotificationFiles] = useState([]);
  const [thisComponentFiles, setSelectedFiles] = useState([]);
  const [selectedFilesName, setSelectedFilesName] = useState([]);
  useEffect(() => {
    if (isOpen && notificationId) {
      // Fetch notification data when the modal is opened
      fetchNotification(notificationId);
    }
  }, [isOpen, notificationId]);

  const fetchNotification = async (notificationId) => {
    try {
      const response = await axios.get(
        `notification/getNotificationById/${notificationId}`
      );
      const fetchedNotification = response.data; // Assuming the API response has the notification data structure

      setContent(fetchedNotification.content);
      setNotificationFiles(fetchedNotification.files || []);
      // Handle fetching and setting other data like files, etc. if needed
    } catch (error) {
      console.error("Error fetching notification:", error.message);
    }
  };


  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "50%", // Adjust width here
      maxHeight: "80vh", // Adjust height here
      overflow: "auto", // Enable scroll if content is larger than the modal
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)", // Adjust the overlay background
    },
  };

  const handleEditorChange = (value) => {
    setContent(value);
  };

  function truncateString(str, length) {
    if (str.length > length) {
      return str.substring(0, length) + "...";
    } else {
      return str;
    }
  }
  const deleteSelectedFile = async (index) => {
    const updatedFiles = [...selectedFilesName];
    updatedFiles.splice(index, 1);
    setSelectedFilesName(updatedFiles);
  };
  
  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(files);
    // const fileNames = Array.from(files).map((file) => file.name);
    const filesArray = Array.from(files);
    // setSelectedFiles(filesArray);
    setSelectedFilesName(filesArray);
  };

  const [, forceUpdate] = useState();

  const handleSave = async () => {
    try {
      let uploadedFileIds = [...existingFiles]; // Start with existing files

      if (thisComponentFiles.length > 0) {
        const formData = new FormData();
        for (const file of thisComponentFiles) {
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
          uploadedFileIds.push(uploadedFiles.data._id);
          notificationFiles.forEach((element) => {
            uploadedFileIds.push(element);
          });
        }
      }

      // Notification update logic
      console.log(uploadedFileIds);
      if (thisComponentFiles.length <= 0) {
        uploadedFileIds = notificationFiles;
      }
      const updatedNotificationData = {
        content: content,
        //   classID: selectedClass._id,
        files: uploadedFileIds,
      };

      const response = await axios.put(
        `notification/updateNotification/${notificationId}`,
        updatedNotificationData
      );
      //   setNotification((prevNotifications) =>
      //   prevNotifications.map((prevNotification) =>
      //     prevNotification._id === notification._id ? response.data : prevNotification
      //   )
      // );
      // setNotification(response.data);
      setNotification((prevNotifications) =>
        prevNotifications.map((prevNotification) =>
          prevNotification._id === notificationId
            ? response.data
            : prevNotification
        )
      );
      setNotificationFiles(response.data.files);
      handleChilderRender();
      // console.log("this is response",response.data.files);
      console.log("Notification updated successfully");
      onClose(); // Close the modal on successful save
    } catch (error) {
      console.error("Error:", error.message);
    }
    setSelectedFiles([]);
    setCreatedFiles([]);
    setNotificationFiles([]);
    setSelectedFilesName([]);
    // forceUpdate();
    // window.location.reload();
  };

  const handleClose = () => {
    // Clear the state and close the modal
    setContent("");
    setSelectedFiles([]);
    setCreatedFiles([]);
    setNotificationFiles([]);
    setSelectedFilesName([]);
    onClose();
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

  //   const getFileInfo = (fileID) => {
  //     // Your logic to fetch file info using fileID, for now, returning a mock object
  //     return {
  //       filename: `File_${fileID}.pdf`, // Example filename
  //       path: `path/to/file/File_${fileID}.pdf`, // Example file path
  //     };
  //   };

  const deleteFile = async (fileID) => {
    console.log("Deleting file with ID:", fileID);
    setNotificationFiles(notificationFiles.filter((id) => id !== fileID));
  };
  // .thisisQuill{
  //   display: block;
  //   height: 200px;
  // }
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
        <div style={{ height: "250px" }}>
          <ReactQuill
            value={content}
            onChange={(value) => setContent(value)}
            style={{ height: "200px" }}
          />
        </div>
        <div className="file-content">
          {notificationFiles.map((fileID, index) => {
            const fileInfo = getFileInfo(fileID);
            console.log(fileID);
            if (fileInfo) {
              const { filename, path } = fileInfo;
              const isPdf = filename.toLowerCase().endsWith(".pdf");
              const isDocx = filename.toLowerCase().endsWith(".docx");
              const isImage =
                filename.toLowerCase().endsWith(".png") ||
                filename.toLowerCase().endsWith(".jpg");

              const iconSrc = isPdf
                ? pdfIcon
                : isDocx
                ? wordIcon
                : isImage
                ? path
                : null;

              return (
                <div className="file-container" key={index}>
                  <a href={path} target="_blank" rel="noopener noreferrer">
                    <div
                      className="file-content-inside"
                      style={{ marginLeft: "10px" }}
                    >
                      <img
                        src={iconSrc}
                        alt="File icon"
                        className="file-icon"
                      />
                      <span className="filename">{filename}</span>
                    </div>
                  </a>
                  {/* <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => deleteFile(fileID)}
                  >
                    Delete
                  </button> */}
                  <HighlightOffIcon className="highlightIcon" onClick={() => deleteFile(fileID)}/>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="upload-save-close">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="custom-file-input"
            id="customFile" // Make sure this matches the label's "for" attribute
          />
          <label className="custom-file-label-edit" htmlFor="customFile">
            <FontAwesomeIcon icon={faUpload} className="mr-2" />
          </label>
          <div>
            {/* {selectedFilesName.length > 0 &&
          selectedFilesName.map((file) => <div key={file}>{file}</div>)} */}

            {selectedFilesName?.map((fileID, index) => {
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
                  <div className="file-container" key={fileID.lastModified}>
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
                          onClick={() => deleteSelectedFile(index)}
                        />
                      </div>
                    </div>
                  </div>
                );
              }
              return null; // or handle the case when fileInfo is not available
            })}
          </div>

          <div style={{ marginTop: "20px" }}>
            <button onClick={handleSave} style={{ marginRight: "10px" }}>
              Save Changes
            </button>
            <button onClick={onClose} style={{ background: "red" }}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

EditNotificationModal.modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
  ],
};

EditNotificationModal.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "script",
  "indent",
  "direction",
  "color",
  "background",
  "align",
];

export default EditNotificationModal;
