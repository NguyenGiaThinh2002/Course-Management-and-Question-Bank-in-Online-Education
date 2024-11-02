import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "../../../../services/axios";
import { useApp } from "../../../../context/AppProvider";
import { lightFormatters } from "date-fns";
import "./myquill.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

import pdf from "../../../../asset/pdf.png";
import word from "../../../../asset/word.png";
import ClearIcon from "@mui/icons-material/Clear";
const MyQuillComponent = ({ onClose , allInfo , isEdit}) => {
  const [content, setContent] = useState("");
  const { selectedClass, setNotification } = useApp();
  const [createdFiles, setCreatedFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [pdfUrls, setPdfUrls] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFilesName, setSelectedFilesName] = useState([]);
  if(isEdit){
    // setContent(editContent);
    console.log(allInfo.editContent);
  }
  const handleEditorChange = (value) => {
    setContent(value);
  };

  

  const handleSave = async () => {
    // console.log("Content:", content);
    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append("pdf", file);
      }

      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPdfUrls(response.data.pdfUrls);

      const Originalname = await response.data.Originalname;
      const path = await response.data.pdfUrls;
      for (const [index, name] of Originalname.entries()) {
        const filesData = {
          originalName: name,
          path: path[index],
        };
        const uploadedFiles = await axios.post("api/createFiles", filesData);
        createdFiles.push(uploadedFiles.data._id);
      }

      const dueDay = new Date(`${allInfo.selectedDate} ${allInfo.selectedTime}`);
      // console.log("this is dueDay",dueDay);

      const notificationData = {
        content: content,
        files: createdFiles,
        dueDay: dueDay,
        classID: allInfo.classID,
        title: allInfo.title,
        submitLatePermission: allInfo.submitLatePermission,
        grade: allInfo.grade
      };


      console.log("save content successfully", notificationData);
      axios
        .post(`assignment/createAssignment`, notificationData)
        .then((response) => {
          console.log("store notification successfully", response.data);
          // setNotification((prevNotifications) => [
          //   ...prevNotifications,
          //   response.data,
          // ]);
        })
        .catch((error) => {
          console.error("Error creating notification:", error);
        });
    } catch (error) {
      console.error("Error uploading files:", error.message);
    }
    setFiles([]);
    setContent("");
    onClose();
  };
  const handleClose = () => {
    setContent("");
    console.log(allInfo);
    onClose();
  };



  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(files);
    const filesArray = Array.from(files);
    setSelectedFilesName(filesArray);
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
  

  return (
    <div>
      <ReactQuill
        value={content}
        onChange={handleEditorChange}
        modules={MyQuillComponent.modules}
        formats={MyQuillComponent.formats}
        className="assignment-Quill"
        placeholder="Nội Dung"
      />
      <div className="custom-container">
        <div className="custom-input">

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="custom-file-input"
            id="customFile" // Make sure this matches the label's "for" attribute
          />
          <label className="custom-file-label" htmlFor="customFile">
            <FontAwesomeIcon icon={faUpload} className="mr-2"/>
          </label>
          
          <div>
          {/* {selectedFiles.length > 0 &&
            selectedFiles.map((file) => <div key={file}>{file}</div>)} */}
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
        </div>
        
        <div className="myQuill-button">
          <button
            onClick={handleSave}
            disabled={
              !content.trim() || !content.replace(/<\/?[^>]+(>|$)/g, "").trim()
            }
          >
            Đăng Bài
          </button>
          <button onClick={handleClose} className="close-btn">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

MyQuillComponent.modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    // [{ header: 1 }, { header: 2 }], 
    [{ list: "ordered" }, { list: "bullet" }],
    // [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }], 
    // [{ direction: "rtl" }],
    // [{ size: ["small", false, "large", "huge"] }], 
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], 
    // [{ font: [] }],
    [{ align: [] }],
    ["clean"], // remove formatting button
  ],
};

MyQuillComponent.formats = [
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

export default MyQuillComponent;
