import React, { useContext, useEffect, useState } from "react";
import axios from "../services/axios";
import { useAuth } from "./AuthProvider";

export const AppContext = React.createContext();
export default function AppProvider({ children }) {
  const { user } = useAuth();
  const [classList, setClassList] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [selectedClassId, setSelectedClassRoomId] = useState("");
  const [notificationByClassId, setNotification] = useState([]);
  const [files, setFiles] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [waitingStudentList, setWaitingStudentList] = useState([]);
  const [render, setRender] = useState(false);
  const [allAssignmentById, setAllAssignmentById] = useState([]);
  const [allSubmittedAssignmentsById, setAllSubmittedAssignmentsById] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openStoringClasses, setOpenStoringClasses] = useState(false);
  const [storedClasses, setStoredClasses] = useState([]);
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [sidebarColor, setSidebarColor] = useState();
  const [headerColor, setHeaderColor] = useState();
  const [userColors, setUserColors] = useState({});
  const UserEmail = user?.email || "";
  // const classID = selectedClassId;
  // QA request
  const [classFolder, setClassFolder] = useState([]);
  const [allLevels, setAllLevels] = useState([]);

  const handleChilderRender = () => {
    setRender(!render);
  };

  const handleChangeSidebarColors = (color) => {
    setSidebarColor(color);
  };
  const handleChangeHeaderColors = (color) => {
    setHeaderColor(color);
  };

  const handleSetOpenStoringClasses = () => {
    setOpenStoringClasses(true);
  };
  const handleSetCloseStoringClasses = () => {
    setOpenStoringClasses(false);
  };

  const handleSetOpenSettings = () => {
    setIsOpenSettings(true);
  };
  const handleSetCloseSettings = () => {
    setIsOpenSettings(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/auth/getUser");
        setAllUser(response.data);
      } catch (error) {
        console.log("Cannot get ClassList", error);
      }
    };
    fetchData();
  }, [render]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/class/getClass");
        setClassList(response.data);
        // console.log(response.data);
      } catch (error) {
        console.log("Cannot get ClassList", error);
      }
    };
    fetchData();
  }, [render]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/class/getStoredClass");
        setStoredClasses(response.data);
      } catch (error) {
        console.log("Cannot get ClassList", error);
      }
    };
    fetchData();
  }, [render]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/getAllFiles");
        setFiles(response.data);
      } catch (error) {
        console.log("Cannot get ClassList", error);
      }
    };
    fetchData();
  }, [render]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedClassId) {
        try {
          const response = await axios.get(
            `/notification/getNotification/${selectedClassId}`
          );
          setNotification(response.data);

          console.log("thisisNoitificationBbyID:", response.data);
        } catch (error) {
          console.log("Cannot get Notification", error);
        }
      } else {
        setNotification([]);
      }
    };
    fetchData();
  }, [selectedClassId, render]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedClassId) {
        try {
          const response = await axios.get(
            `/assignment/getAllAssignmentsById/${selectedClassId}`
          );
          if (!response) {
            setLoading(true);
          }
          if (response) {
            setLoading(false);
          }
          setAllAssignmentById(response.data);
          console.log("this is AllAssignment", allAssignmentById);
        } catch (error) {
          console.log("Cannot get AllAssignmentById", error);
        }
      }
    };
    fetchData();
  }, [selectedClassId, render]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedClassId) {
        try {
          const response = await axios.get(
            `/submittedAssignment/getAllSubmittedAssignmentsById/${selectedClassId}`
          );
          setAllSubmittedAssignmentsById(response.data);
          console.log(
            "this is submittedAssignment",
            allSubmittedAssignmentsById
          );
        } catch (error) {
          console.log("Cannot get AllAssignmentById", error);
        }
      }
    };
    fetchData();
  }, [selectedClassId, render]);

  // Start Qa request
  useEffect(() => {
    const fetchData = async () => {
      if (selectedClassId) {
        try {
          const response = await axios.get(
            `/classFolder/getClassFolder/${selectedClassId}`
          );
          setClassFolder(response.data);
        } catch (error) {
          console.log("Cannot get classFolder", error);
        }
      } else {
        setClassFolder([]);
      }
    };
    fetchData();
  }, [render, selectedClassId]);

  

  // End QA request

  useEffect(() => {
    const fetchData = async () => {
      if (selectedClassId) {
        try {
          const listIds = selectedClass.studentID;
          const response = await axios.get("/auth/getUserById", {
            params: {
              listIds: listIds,
            },
          });
          console.log(response.data);
          setStudentList(response.data); // Assuming the response contains the data property
        } catch (error) {
          console.log("Cannot get StudentList", error);
        }
      }
    };

    fetchData();
  }, [render, selectedClassId]); // Include selectedClassId as a dependency

  useEffect(() => {
    const fetchData = async () => {
      if (selectedClassId) {
        try {
          const listIds = selectedClass.waitingStudents;
          const response = await axios.get("/auth/getUserById", {
            params: {
              listIds: listIds,
            },
          });
          console.log(response.data);
          setWaitingStudentList(response.data); // Assuming the response contains the data property
        } catch (error) {
          console.log("Cannot get StudentList", error);
        }
      }
    };

    fetchData();
  }, [selectedClassId, render]); // Include selectedClassId as a dependency

  const loginnedUserId = React.useMemo(
    () => allUser.find((user) => user.email === UserEmail) || {},
    [allUser, UserEmail],
    [render]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/colors/getColors/${loginnedUserId._id}`
        );
        if (response) {
          setUserColors(response.data);
          setSidebarColor(response.data.sidebarColor);
          setHeaderColor(response.data.headerColor);
        } else {
          setSidebarColor("#00274e");
          setHeaderColor("#00274e");
        }
      } catch (error) {
        setSidebarColor("#00274e");
        setHeaderColor("#00274e");
        console.log("Cannot get Colors", error);
      }
    };
    fetchData();
  }, [loginnedUserId._id]);

  const recommentedUser = React.useMemo(
    () =>
      allUser.filter(
        (user) => user.email !== UserEmail && user.role !== "teacher"
      ) || [],
    [allUser, UserEmail]
  );

  const classListByTeacherID = React.useMemo(
    () =>
      classList.filter(
        (thisclass) => thisclass.teacherID === loginnedUserId._id
      ) || [],
    [classList, loginnedUserId._id]
  );

  const selectedClass = React.useMemo(
    () =>
      classList.find((classRoom) => classRoom._id === selectedClassId) || {},
    [classList, selectedClassId]
  );

  const classListOfStudent = React.useMemo(() => {
    const foundClasses = classList.filter((classRoom) =>
      classRoom.studentID.some((id) => id === loginnedUserId._id)
    );
    return foundClasses;
  }, [classList, loginnedUserId]);

  const setClassEmpty = () => {
    setSelectedClassRoomId("");
  };

  const findPerson = (id) => {
    const thePerson = allUser.find((user) => user._id === id);
    return thePerson;
  };

  const findAssignment = (id) => {
    const theAssignment = allAssignmentById.find(
      (assignment) => assignment._id === id
    );
    return theAssignment;
  };

  const findClass = (id) => {
    const theClass = classList.find((thisClass) => thisClass._id === id);
    return theClass;
  };
  // const submittedAssignmentsByStudentId = React.useMemo(
  //     () => allSubmittedAssignmentsById.find((assigmentItem) => assigmentItem.studentID === selectedClassId) || {},
  //     [classList, selectedClassId]
  // );

  const submittedAssignmentsByStudentId = (id) => {
    const theAssignment =
      allSubmittedAssignmentsById.filter(
        (assignment) => assignment.studentID === id
      ) || [];
    return theAssignment;
  };

  const findSubmittedAssignment = (id) => {
    const theAssignment = allSubmittedAssignmentsById.find(
      (assignment) => assignment.assignmentID === id
    );
    if (theAssignment) {
      return theAssignment;
    } else {
      return [];
    }
  };

  const findSubmittedAssignmentByStudentId = (id, studentID) => {
    const theAssignment = allSubmittedAssignmentsById.find(
      (assignment) =>
        assignment.assignmentID === id && assignment.studentID === studentID
    );
    if (theAssignment) {
      return theAssignment;
    } else {
      return [];
    }
  };

  return (
    <AppContext.Provider
      value={{
        classFolder,
        classList,
        classListByTeacherID,
        selectedClass,
        allAssignmentById,
        allUser,
        loginnedUserId,
        classListOfStudent,
        loading,
        allSubmittedAssignmentsById,
        isOpenSettings,
        headerColor,
        userColors,
        sidebarColor,
        openStoringClasses,
        storedClasses,
        waitingStudentList,
        recommentedUser,
        notificationByClassId,
        files,
        studentList,
        setNotification,
        setFiles,
        setStudentList,
        setSelectedClassRoomId,
        setClassList,
        setClassEmpty,
        handleChilderRender,
        findPerson,
        findAssignment,
        findSubmittedAssignment,
        submittedAssignmentsByStudentId,
        findSubmittedAssignmentByStudentId,
        setWaitingStudentList,
        handleSetOpenStoringClasses,
        handleSetCloseStoringClasses,
        findClass,
        handleSetCloseSettings,
        handleSetOpenSettings,
        handleChangeSidebarColors,
        handleChangeHeaderColors,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export const useApp = () => {
  return useContext(AppContext);
};
