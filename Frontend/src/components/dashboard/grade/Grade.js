import React, { useState } from "react";
import "./grade.css";
import { useApp } from "../../../context/AppProvider";
import MarkGradeModal from "./markGradeModal/MarkGradeModal";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import StudentGrade from "./studentGrade/StudentGrade";

export default function Grade() {
  const { allSubmittedAssignmentsById, findAssignment, findPerson } = useApp();
  const [openMarkGradeModal, setMarkGradeModal] = useState(false);
  const [submittedAssignment, setSubmittedAssignment] = useState({});
  const [onTimeChecked, setOnTimeChecked] = useState(true);
  const [lateChecked, setLateChecked] = useState(true);

  const [selectedNavItem, setSelectedNavItem] = useState(0);
  const handleNavItemClick = (index) => {
    setSelectedNavItem(index);
  };

  const handleOnTimeChange = (event) => {
    setOnTimeChecked(event.target.checked);
    console.log(onTimeChecked);
  };

  const handleLateChange = (event) => {
    setLateChecked(event.target.checked);
    console.log(lateChecked);
  };

  const handleOpenMarkGradeModal = (submittedAssignment) => {
    setSubmittedAssignment(submittedAssignment);
    setMarkGradeModal(!openMarkGradeModal);
  };
  return (
    // dinh height cho nay
    <div style={{ height: "100%" }}>
      {openMarkGradeModal && (
        <MarkGradeModal
          submittedAssignment={submittedAssignment}
          onClose={handleOpenMarkGradeModal}
        />
      )}
      {!openMarkGradeModal && (
        <div style={{ display: "flex" }}>
          <div className="grade-sidebar">
            {/* <ul className="grade-sidebar-menu">
              <li>Tất Cả</li>
              <li>Chưa Chấm Điểm</li>
              <li>Đã Chấm Điểm</li>
            </ul> */}
            <div
              className={`grade-nav-item ${
                selectedNavItem === 0 ? "selected" : ""
              }`}
              onClick={() => handleNavItemClick(0)}
            >
              Tất Cả
            </div>
            <div
              className={`grade-nav-item ${
                selectedNavItem === 1 ? "selected" : ""
              }`}
              onClick={() => handleNavItemClick(1)}
            >
              Chưa Chấm Điểm
            </div>
            <div
              className={`grade-nav-item ${
                selectedNavItem === 2 ? "selected" : ""
              }`}
              onClick={() => handleNavItemClick(2)}
            >
              Đã Chấm Điểm
            </div>
            <div
              className={`grade-nav-item ${
                selectedNavItem === 3 ? "selected" : ""
              }`}
              onClick={() => handleNavItemClick(3)}
            >
              Học Sinh
            </div>
          </div>
          {selectedNavItem === 3 && <StudentGrade/>}
          <div className="submittedAssignment-body-content">
    
            {selectedNavItem !== 3 && (
              <div>
                <FormGroup style={{ display: "flex", flexDirection: "row" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={onTimeChecked}
                        onChange={handleOnTimeChange}
                      />
                    }
                    label="Nộp Đúng Hạn"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={lateChecked}
                        onChange={handleLateChange}
                      />
                    }
                    label="Nộp Trễ Hạn"
                  />
                </FormGroup>
              </div>
            )}

            <div className="submittedAssignment-list">
              {selectedNavItem !== 3 &&
                allSubmittedAssignmentsById?.map(
                  (submittedAssignment, index) => {
                    // Find the student outside of JSX
                    // const teacher = allUser.find((user) => user._id === classItem.teacherID);
                    const assigmentItem = findAssignment(
                      submittedAssignment.assignmentID
                    );
                    if (
                      !onTimeChecked &&
                      !submittedAssignment.isLateSubmission
                    ) {
                      return;
                    }

                    if (!lateChecked && submittedAssignment.isLateSubmission) {
                      return;
                    }

                    if (
                      selectedNavItem === 1 &&
                      submittedAssignment.markedGrade
                    ) {
                      return;
                    }

                    if (
                      selectedNavItem === 2 &&
                      !submittedAssignment.markedGrade
                    ) {
                      return;
                    }
                    const student = findPerson(submittedAssignment.studentID);
                    return (
                      <div
                        key={submittedAssignment._id}
                        className="submittedAssignment-card"
                        style={{ position: "relative" }}
                        onClick={() =>
                          handleOpenMarkGradeModal(submittedAssignment)
                        }
                      >
                        <div
                          className="submittedAssignment-card-content"
                          onClick={() => {
                            // setSelectedClassRoomId(classItem._id);
                            // handleItemClick(index);
                          }}
                          style={{
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          <div style={{ display: "flex" }}>
                            <div>
                              <img
                                src={student.photoURL}
                                alt=""
                                style={{ width: "50px", borderRadius: "50px" }}
                              ></img>
                            </div>
                            <div style={{ color: "black", marginLeft: "10px" }}>
                              {student.username}
                            </div>
                          </div>
                          <div
                            style={{
                              color: "black",
                              margin: "10px",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            Đã nộp bài tập {assigmentItem.title}
                            {<br />}
                          </div>
                        </div>
                        <div
                          style={{
                            color: "black",
                            margin: "10px 20px 10px 20px",
                            marginTop: "20px",
                          }}
                        >
                          {submittedAssignment.submissionFiles.length} file đính
                          kèm
                        </div>
                        {submittedAssignment.isLateSubmission === true && (
                          <div
                            style={{
                              color: "red",
                              margin: "10px",
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
                              margin: "10px",
                              alignSelf: "flex-end",
                            }}
                          >
                            Nộp Đúng Hạn
                          </div>
                        )}
                        {/* {submittedAssignment.markedGrade && <div>Đã Chấm Điểm<div>} */}
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
