import React, { useState } from "react";
import { useApp } from "../../../context/AppProvider";
import Quill from "./myQuillModal/MyQuill";
import axios from "../../../services/axios";
import "./assignment.css";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
// import { FlareSharp } from "@mui/icons-material";
import ReactQuill from "react-quill";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import pdf from "../../../asset/pdf.png";
import word from "../../../asset/word.png";
import checklist from "../../../asset/checklist.png";
import AssignmentDetail from "../assigmentDetail/AssignmentDetail";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ClearIcon from "@mui/icons-material/Clear";

export default function Assignment() {
  const [OpenModal, SetOpenModal] = useState(false);
  const [openAssignmentDetail, setOpenAssignmentDetail] = useState(false);
  const [assignmentDetail, setAssignmentDetail] = useState({});
  const {
    classListByTeacherID,
    allAssignmentById,
    files,
    handleChilderRender,
    loginnedUserId,
    findClass,
  } = useApp();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [checked, setChecked] = useState(false);
  const [title, setTitle] = useState("");
  const [grade, setGrade] = useState(0);
  const [selectedClassID, setSelectedClassId] = React.useState([]);

  const [showOptions, setShowOptions] = useState(false);
  const [showOptionsId, setShowOptionsId] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const [content, setContent] = useState("");
  const [createdFiles, setCreatedFiles] = useState([]);

  const [existingFiles, setExistingFiles] = useState([]);
  const [assignmentFiles, setAssignmentFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [pdfUrls, setPdfUrls] = useState([]);
  const [selectedFilesName, setSelectedFilesName] = useState([]);
  const [editAssignmentID, setSelectedAssignmentID] = useState("");
  const formatDueDate = (timestamp) => {
    const options = {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(timestamp).toLocaleDateString("en-US", options);
  };

  const editAssignment = (assignment) => {
    console.log(assignment);
    setIsEdit(!isEdit);
    // setIsEdit(assignment)
    // setEditContent(assignment.content);
    const {
      submitLatePermission,
      dueDay,
      title,
      grade,
      classID,
      content,
      files,
      _id,
    } = assignment;
    // Parse the string into a Date object
    const [datePart, timePart] = dueDay.split("T");
    const editSelectedDate = datePart; // selectedDate will be '2024-05-21'
    const editSelectedTime = timePart.substring(0, 5); // selectedTime will be '05:29'

    setChecked(submitLatePermission);
    setSelectedTime(editSelectedTime);
    setSelectedDate(editSelectedDate);
    setTitle(title);
    setGrade(grade);
    setSelectedClassId(classID);
    setContent(content);
    setAssignmentFiles(files);
    setSelectedAssignmentID(_id);

    SetOpenModal(!OpenModal);
  };

  /// My Quill
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
    // if (isEdit) {

    // } else {
    //   setAssignmentFiles(files);
    // }
    // const fileNames = Array.from(files).map((file) => file.name);
    // setSelectedFilesName(fileNames);
    const filesArray = Array.from(files);
    setSelectedFilesName(filesArray);
  };
  const handleSave = async () => {
    if (!title) {
      alert("Vui lòng nhập tên tiêu đề");
      return;
    } else if (!selectedClassID || selectedClassID.length === 0) {
      alert("Vui lòng chọn lớp học");
      return;
    } else if (!grade) {
      alert("Vui lòng nhập điểm");
      return;
    } else if (!selectedDate ) {
      alert("Vui lòng nhập đầy đủ ngày");
      return;
    }else if(!selectedTime){
      alert("Vui lòng nhập đầy đủ giờ");
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
          uploadedFileIds.push(uploadedFiles.data._id);
          if (isEdit) {
            assignmentFiles.forEach((element) => {
              uploadedFileIds.push(element);
            });
          }
        }
      }

      if (selectedFiles.length <= 0) {
        uploadedFileIds = assignmentFiles;
      }
      console.log("selectedDate", selectedDate);
      console.log("selectedTime", selectedTime);
      // const thisDueDay = new Date(`${selectedDate} ${selectedTime}`);
      const dueDay = new Date(`${selectedDate}T${selectedTime}`);
      const thisDueDay = formatDueDate(dueDay);
      console.log("this is dueDay", thisDueDay);

      const parsedDate = new Date(dueDay);

      // Convert the date to BSON Date object
      const bsonDate = new Date(
        Date.UTC(
          parsedDate.getFullYear(),
          parsedDate.getMonth(),
          parsedDate.getDate(),
          parsedDate.getHours(),
          parsedDate.getMinutes(),
          parsedDate.getSeconds(),
          parsedDate.getMilliseconds()
        )
      );

      // if (isEdit) {
      //   console.log("edit success");
      // } else {
      // }
      const assignmentData = {
        content: content,
        files: uploadedFileIds,
        dueDay: bsonDate,
        // dueDate: selectedDate,
        // dueTime: selectedTime,
        classID: selectedClassID,
        title: title,
        submitLatePermission: checked,
        grade: grade,
      };

      if (isEdit) {
        console.log("edit success");
        assignmentData._id = editAssignmentID;
        axios
          .put(`assignment/updateAssignmentsById`, assignmentData)
          .then((response) => {
            console.log("store notification successfully", response.data);
          })
          .catch((error) => {
            console.error("Error creating notification:", error);
          });
      } else {
        console.log("save content successfully", assignmentData);
        axios
          .post(`assignment/createAssignment`, assignmentData)
          .then((response) => {
            console.log("store notification successfully", response.data);
          })
          .catch((error) => {
            console.error("Error creating notification:", error);
          });
      }
    } catch (error) {
      console.error("Error uploading files:", error.message);
    }

    setSelectedFiles([]);
    setSelectedFilesName([]);
    handleChilderRender();
    setIsEdit(false);
    setContent("");
    setChecked(false);
    setSelectedTime("");
    setSelectedDate("");
    setTitle("");
    setGrade("");
    setSelectedClassId([]);
    setAssignmentFiles([]);
    setCreatedFiles([]);
    SetOpenModal(!OpenModal);
    // onClose();
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setSelectedFilesName([]);
    setIsEdit(false);
    setContent("");
    setChecked(false);
    setSelectedTime("");
    setSelectedDate("");
    setTitle("");
    setGrade("");
    setSelectedClassId([]);
    setAssignmentFiles([]);
    setCreatedFiles([]);
    SetOpenModal(!OpenModal);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const formatDate = (timestamp) => {
    // const options = { month: "numeric", day: "numeric", year: "numeric" };
    // return new Date(timestamp).toLocaleDateString("en-US", options);
    const [datePart, timePart] = timestamp.split("T");
    const editSelectedDate = datePart; // selectedDate will be '2024-05-21'

    return editSelectedDate;
  };

  // const [allClassOfTeacher,setAllClassOfTeacher] = useState([])
  // const allClassNameOfTeacher = classListByTeacherID.map((allClass) => allClass.className)

  const names = classListByTeacherID;
  //console.log("this is thinh", classListByTeacherID);
  const handleChangeMutipleCheckBox = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedClassId(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleCheckedChange = (event) => {
    setChecked(event.target.checked);
  };
  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };
  const AssignmentModal = () => {
    SetOpenModal(!OpenModal);
  };

  const toggleOptions = (notificationId) => {
    setShowOptionsId((currentShowOptionsId) =>
      currentShowOptionsId === notificationId ? null : notificationId
    );
    setShowOptions(!showOptions);
  };
  const deleteAssignmentById = async (assignmentID) => {
    await axios.post(`assignment/deleteAssignment/${assignmentID}`).then(() => {
      console.log("delete successfully");
      handleChilderRender();
    });
  };

  const deleteFile = async (fileID) => {
    console.log("Deleting file with ID:", fileID);
    setAssignmentFiles(assignmentFiles.filter((id) => id !== fileID));
    setCreatedFiles(assignmentFiles.filter((id) => id !== fileID));
  };

  const items = allAssignmentById.slice().reverse();
  const [activeIndex, setActiveIndex] = useState(null);

  const onTitleClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  const showIntruction = (item) => {
    setOpenAssignmentDetail(true);
    setAssignmentDetail(item);
    console.log("showIntruction", item);
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
              <div style={{ marginRight: "10px" }}>
                {" "}
                Đã đăng vào ngày {formatDate(item.createdAt)}
              </div>
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                }}
              >
                {loginnedUserId.role === "teacher" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Stop event propagation
                      toggleOptions(item._id);
                    }}
                    className="icon-button"
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>
                )}

                {showOptionsId === item._id && (
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
                )}
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
            {loginnedUserId.role === "student" && (
              <button
                className="assignment-common-button"
                style={{ color: "#1a73e8" }}
                onClick={() => showIntruction(item)}
              >
                Xem Hướng Dẫn
              </button>
            )}
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="assignment-container">
      {openAssignmentDetail && (
        <AssignmentDetail assignmentDetail={assignmentDetail} />
      )}
      <div>
        {!OpenModal && !openAssignmentDetail && (
          <div>
            <div>
              {loginnedUserId.role === "teacher" && (
                <button
                  className="add-assignment-button"
                  onClick={AssignmentModal}
                >
                  + Tạo Bài Tập
                </button>
              )}
            </div>
            <div
              className="list-assignment-container"
              style={{ marginTop: "40px" }}
            >
              <div className="accordion">{renderItems}</div>
            </div>
          </div>
        )}
      </div>

      <div className="open-modal-myquill">
        {OpenModal && (
          <div>
            <div className="all-assigment-info" >
              <div className="assignmentModal-info" >
                <TextField
                  id="outlined-basic"
                  label="Chủ đề"
                  required
                  variant="outlined"
                  className="assignTitle"
                  onChange={handleTitleChange}
                  value={title}
                />
                <div className="assignmentModal">
                  {/* <Quill onClose={AssignmentModal} allInfo={allInfo} editContent isEdit/> */}
                  <div>
                    <ReactQuill
                      value={content}
                      onChange={handleEditorChange}
                      modules={Assignment.modules}
                      formats={Assignment.formats}
                      className="assignment-Quill"
                      placeholder="Nội Dung"
                    />
                    <div className="custom-container" style={{height:"100%"}}>
                    <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="custom-file-input"
                          id="customFile" // Make sure this matches the label's "for" attribute
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="customFile"
                        >
                          <FontAwesomeIcon icon={faUpload} className="mr-2" />
                        </label>
                      <div className="custom-input">
                        

                        <div style={{width:"450px"}}>
                          <div className="file-content" >
                          {selectedFilesName?.map((fileID, index) => {
                            // const fileInfo = getFileInfo(fileID);
                            if (fileID) {
                              const filename = fileID.name;
                              const isPdf = filename
                                .toLowerCase()
                                .endsWith(".pdf");
                              const isDocx = filename
                                .toLowerCase()
                                .endsWith(".docx");
                              const isImage =
                                filename.toLowerCase().endsWith(".png") ||
                                filename.toLowerCase().endsWith(".jpg");
                              // filename = truncateString(filename, 15)
                              // Choose the appropriate image based on the file extension
                              const iconSrc = isPdf
                                ? pdf
                                : isDocx
                                ? word
                                : isImage;
                              return (
                                <div
                                  className="file-container"
                                  key={fileID.lastModified}
                                >
                                  <div className="files">
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
                                        {truncateString(filename, 15)}
                                      </span>
                                      <ClearIcon
                                        className="clear-file-icon"
                                        onClick={() =>
                                          deleteSelectedFile(index)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null; // or handle the case when fileInfo is not available
                          })}
                          </div>

                          {isEdit && (
                            <div className="file-content" >
                              {assignmentFiles.length > 0 &&
                                assignmentFiles.map((fileID, index) => {
                                  const fileInfo = getFileInfo(fileID);
                                  if (fileInfo) {
                                    const { filename, path } = fileInfo;
                                    const isPdf = filename
                                      .toLowerCase()
                                      .endsWith(".pdf");
                                    const isDocx = filename
                                      .toLowerCase()
                                      .endsWith(".docx");
                                    const isImage = filename
                                      .toLowerCase()
                                      .endsWith(".png");

                                    // Choose the appropriate image based on the file extension
                                    const iconSrc = isPdf
                                      ? pdf
                                      : isDocx
                                      ? word
                                      : isImage
                                      ? path
                                      : null;
                                    return (
                                      <div
                                        className="file-container"
                                        key={fileID}
                                      >
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
                                        {/* <button
                                          style={{ marginLeft: "10px" }}
                                          onClick={() => deleteFile(fileID)}
                                        >
                                 
                                          Delete
                                        </button> */}
                                        {/* thinh */}
                                        <HighlightOffIcon
                                          className="highlightIcon"
                                          onClick={() => deleteFile(fileID)}
                                        />
                                      </div>
                                    );
                                  }
                                  return null; // or handle the case when fileInfo is not available
                                })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="myQuill-button">
                        <button
                          onClick={handleSave}
                          disabled={
                            !content.trim() ||
                            !content.replace(/<\/?[^>]+(>|$)/g, "").trim()
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
                </div>
              </div>
              <div className="assignment-other-info">
                <div className="assignment-other-info-items">
                  <div className="assignment-info-name">Dành Cho</div>

                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-checkbox-label">
                      Lớp học
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      required
                      multiple
                      value={selectedClassID}
                      onChange={handleChangeMutipleCheckBox}
                      input={<OutlinedInput label="Lớp học" />}
                      // renderValue={(selected) =>
                      //   selected
                      //     .map(
                      //       (id) =>
                      //       names.find((name) => name._id === id).className
                      //     )
                      //     .join(", ")
                      // }
                      renderValue={(selected) =>
                        selected
                          .map((id) => findClass(id)?.className)
                          .join(", ")
                      }
                      // renderValue={(selected) => selected.join(", ")}
                      MenuProps={MenuProps}
                    >
                      {names.length > 0 &&
                        names.map((name) => (
                          <MenuItem key={name._id} value={name._id}>
                            <Checkbox
                              checked={selectedClassID.indexOf(name._id) > -1}
                            />
                            <ListItemText primary={name.className} />
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="assignment-other-info-items">
                  <div className="assignment-info-name">Điểm</div>
                  <div>
                    <TextField
                      id="filled-number"
                      required
                      sx={{ m: 1 }}
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
                </div>
                <div className="assignment-other-info-items">
                  <div className="assignment-info-name">Hạn Nộp</div>
                  <div className="text-field">
                    <div className="text-field-items">
                      <TextField
                        sx={{ m: 1, marginLeft: 0 }}
                        id="date"
                        required
                        label="Ngày Tháng"
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        className="han-nop"
                      />
                    </div>
                    <div className="text-field-items">
                      <TextField
                        sx={{ m: 1 }}
                        id="time"
                        required
                        label="Thời Gian"
                        type="time"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5 min step, can be changed as needed
                        }}
                        className="han-nop"
                      />
                    </div>
                  </div>
                </div>
                <div className="assignment-other-info-items">
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ m: 1 }}
                        checked={checked}
                        value={checked}
                        onChange={handleCheckedChange}
                        name="checkedInput"
                        color="primary"
                        // value={}
                      />
                    }
                    label="Đóng tính năng nộp bài sau ngày đến hạn "
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Assignment.modules = {
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

Assignment.formats = [
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
