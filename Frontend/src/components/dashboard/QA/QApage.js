import React, { useState } from "react";
import { useApp } from "../../../context/AppProvider";
import "./QApage.css";
import CreateFolderClass from "./folderModal/createFolderModal";
import ChosenFolderPage from "./ChosenFolder/ChosenFolderPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import EditFolderClass from "./folderModal/editFolderModel";

export default function QApage() {
  const { classFolder} = useApp();
  const [openCreateFolder, setCreateFolder] = useState(false);
  const [selectedFolderId, setFolderId] = useState("");
  const [openSelectedFolder, setOpenSelectedFolder] = useState (false);

  const [selectedEditFolderId, setselectedEditFolderId] = useState("");
  const [openEditFolder, setEditFolder] = useState(false);

  const handleEditClick = (folderId) => {
    setselectedEditFolderId(folderId);
    setEditFolder(true);
  };
  const closeEditFolderClass = () => {
    setEditFolder(false);
  };

  const openCreateFolderClass = () => {
    setCreateFolder(true);
  };
  const closeCreateFolderClass = () => {
    setCreateFolder(false);
    console.log("classFolder" + classFolder);
  };

  const handleSelectedFolder = (folderID) => {
    setFolderId(folderID);
    setOpenSelectedFolder(true);
  }

  const handleCloseSelectedFolder = () =>{
    setOpenSelectedFolder(false);
  }

  return (
    <div>
      <div>
      {!openSelectedFolder &&  <button
          className="add-assignment-button"
          onClick={openCreateFolderClass}
        >
          + Tạo Thư Mục
        </button>}
       
        {/* <div> {openCreateFolder && <CreateFolderClass/>}</div> */}
        <CreateFolderClass
          isOpen={openCreateFolder}
          onClose={closeCreateFolderClass}
        />
      </div>
      <div className="QA-list">
        {!openSelectedFolder && classFolder?.map((folder, index) => {
          return (
            <div key={index}>
              <div
                key={index}
                className="QA-card"
                style={{ position: "relative" }}
                onClick={() =>{
                  handleSelectedFolder(folder._id)
                  }
                }
              >
                <div
                  className="QA-card-content"
                  onClick={() => {
                    // setSelectedClassRoomId(classItem._id);
                    // handleItemClick(index);
                  }}
                  style={{
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                > 
                  <div className="folder-name">
                    Tên Thư Mục: {folder.folderName}
                  </div>
                  {/* <div className="QA-card-buttons">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="class-icon"
                      style={{ color: "green" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(folder._id)
                        // handleEditClick(classItem._id);
                      }}
                    />
                    <FontAwesomeIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        // handleStoreClick(classItem);
                      }}
                      className="class-icon"
                      icon={faTimes}
                      style={{ color: "red" }}
                    />
                  </div> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        {openSelectedFolder && <ChosenFolderPage folderId={selectedFolderId} close={handleCloseSelectedFolder}/>}
      </div>

      <EditFolderClass
        isOpen={openEditFolder}
        onClose={closeEditFolderClass}
        editFolderId={selectedEditFolderId}
      />
    </div>
  );
}
