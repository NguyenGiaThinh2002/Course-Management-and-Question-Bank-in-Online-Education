import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import "../body/body.css";
import { useApp } from "../../context/AppProvider";
import axios from "../../services/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
export default function Body() {
  const { allUser, handleChildRender } = useApp();
  const acceptTeacher = (Id) => {
    const userData = {
      role: "teacher",
    };
    const userId = Id;
    try {
      axios
        .put(`auth/updateUserRole/${userId}`, userData)
        .then(console.log("updateRole successfully"));
      handleChildRender();
    } catch (error) {
      console.log("updateRole failed: " + error);
    }
  };
  const refuseTeacher = (Id) => {
    const userData = {
      role: "student",
    };
    const userId = Id;
    try {
      axios
        .put(`auth/updateUserRole/${userId}`, userData)
        .then(console.log("updateRole successfully"));
      handleChildRender();
    } catch (error) {
      console.log("updateRole failed: " + error);
    }
  };

  return (
    <div className="admin-table-container">
      <div className="admin-table">
        <TableContainer component={Paper}>
          <Table aria-label="user table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                {/* Add more table header cells if needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {allUser.map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  {user.role === "waitingTeacher" && (
                    <>
                      <TableCell>
                        <div className="accept-refuse-button">
                          <div
                            onClick={() => acceptTeacher(user._id)}
                            className="accept-button"
                          >
                            Chấp Nhận
                          </div>
                          <div
                            onClick={() => refuseTeacher(user._id)}
                            className="refuse-button"
                          >
                            Từ Chối
                          </div>
                        </div>
                        
                      </TableCell>
                    </>
                  )}
                  {user.role !== "waitingTeacher" && (
                    <TableCell>{user.role}</TableCell>
                  )}

                  {/* Add more table cells if needed */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
