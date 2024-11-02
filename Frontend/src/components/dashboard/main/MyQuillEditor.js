import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "../../../services/axios";
import { useApp } from "../../../context/AppProvider";
import { lightFormatters } from "date-fns";
import "./MyQuill.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import pdf from "../../../asset/pdf.png";
import word from "../../../asset/word.png";
import ClearIcon from "@mui/icons-material/Clear";
const MyQuillComponent = ({ onClose }) => {
  const [content, setContent] = useState("");
  const { selectedClass, setNotification, handleChilderRender } = useApp();
  const [createdFiles, setCreatedFiles] = useState([]);
  const handleEditorChange = (value) => {
    setContent(value);
  };
  
  const handleSave = async () => {
    console.log("Content:", content);
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

      const notificationData = {
        content: content,
        classID: selectedClass._id,
        files: createdFiles,
      };
      await axios
        .post(`notification/createNotification`, notificationData)
        .then((response) => {
          console.log("store notification successfully", response.data);
          setNotification((prevNotifications) => [
            ...prevNotifications,
            response.data,
          ]);
          handleChilderRender()
        })
        .catch((error) => {
          console.error("Error creating notification:", error);
        });

      // const UpdatedFiles = await axios.get('/api/getAllFiles')
      // setFiles(UpdatedFiles.data)
    } catch (error) {
      console.error("Error uploading files:", error.message);
    }
    
    setFiles([]);
    setContent("");
    onClose();
  };
  const handleClose = () => {
    setContent("");
    onClose();
  };

  function truncateString(str, length) {
    if (str.length > length) {
      return str.substring(0, length) + "...";
    } else {
      return str;
    }
  }

  const [files, setFiles] = useState([]);
  const [pdfUrls, setPdfUrls] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    setFiles(files);
    const filesArray = Array.from(files);
    setSelectedFiles(filesArray);

  };

  const deleteFile = async (index) => {
    const updatedFiles = [...selectedFiles];  
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  return (
    <div>
      <ReactQuill
        value={content}
        onChange={handleEditorChange}
        modules={MyQuillComponent.modules}
        formats={MyQuillComponent.formats}
        className="thisisQuill"
      />
      <div className="custom-container-edit">
        <div className="custom-input-edit">
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
            {selectedFiles.length > 0 && (
                <div className="file-content" style={{width:"500px"}}>
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
          </div>
        </div>
        
        <div className="myQuill-button-edit">
          <button
            onClick={handleSave}
            disabled={
              !content.trim() || !content.replace(/<\/?[^>]+(>|$)/g, "").trim()
            }
          >
            Save Content
          </button>
          <button onClick={handleClose} className="close-btn">
            Close
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
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }], 
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], 
    [{ align: [] }],
    ["clean"], // remove formatting button


    [{ script: "sub" }, { script: "super" }],
    [{ size: ["small", false, "large", "huge"] }], 
    [{ direction: "rtl" }],
    [{ font: [] }],
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
