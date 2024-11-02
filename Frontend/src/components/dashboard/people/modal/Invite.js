import React, { useState } from "react";
import "../modal/invite.css";
import { useApp } from "../../../../context/AppProvider";
import axios from '../../../../services/axios'


const InviteModal = ({ onClose }) => {
    const {recommentedUser, selectedClass, setSelectedClassRoomId, setStudentList, } = useApp()

  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleUserSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };
  const handleInvite = async () => {
    console.log("Inviting users:", selectedUsers);
    try {
        // Make an HTTP POST request to add selected users to the class
        const response = await axios.post(`/auth/addUser/${selectedClass._id}`, { selectedUsers });
        // setNotification((prevClasses) => [...prevClasses, response.data.result]);
        const listStudents = await axios.get('/auth/getUserById', {
          params: {
            listIds: response.data.result.studentID
          }
        });
        console.log(listStudents.data);

        setStudentList(listStudents.data); 
        // setSelectedClassRoomId((prevClasses) => [...prevClasses, response.data.result]);
        onClose()
        // console.log('Server response:', response.data.result.studentID);

      } catch (error) {
        console.error('Error adding selected users to class:', error);
      }
  };
  const handleRemoveUser = (userId) => {
    setSelectedUsers((prevSelected) => prevSelected.filter((id) => id !== userId));
  };

  return (
    <div className="overlay">
    <div className="invite-modal">
      <h2>Invite Friends</h2>
      <ul className="user-list">
        {recommentedUser.map((user) => (
          <li key={user._id} onClick={() => handleUserSelection(user._id)}>
            <div className={`user-card ${selectedUsers.includes(user._id) ? 'selected' : ''}`}>
              <img src={user.photoURL} alt={user.name} className="user-avatar" />
              <span>{user.username}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="selected-users">
        {selectedUsers.map((userId) => (
          <div key={userId} className="selected-user">
            { recommentedUser.find((user) => user._id === userId).username}
            <span
              className="remove-icon"
              onClick={() => handleRemoveUser(userId)}
              role="button"
              tabIndex={0}
            >
              &#10005;
            </span>
          </div>
        ))}
      </div>

      <button onClick={handleInvite}>Invite Selected Users</button>
      <button onClick={onClose}>Close Modal</button>
    </div>
    </div>
  );
};

export default InviteModal;
