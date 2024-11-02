const User = require("../models/User");
const ClassRoom = require("../models/ClassRoom");
const dotenv = require("dotenv");
dotenv.config();
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
class AuthController {
  async checkAdmin(req, res) {
    const adminUsername = process.env.REACT_APP_USERNAME;
    const adminPassword = process.env.REACT_APP_PASSWORD;
    try {
      const { username, password } = req.body;
      console.log(username);
      if (adminUsername === username && adminPassword === password) {
        const adminName = "nguyengiathinh";
        return res.status(200).json(adminName);
      } else {
        return res.status(500).json(error);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async register(req, res) {
    // const {username,password,email} = req.body;

    try {
      const username = req.body.username;
      const photoURL = req.body.photoURL;
      const email = req.body.email;
      const role = req.body.role;
      // const { username, password, email, role } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(200).send("login successful");
      }
      const user = await User.create({ username, photoURL, email, role });
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
  async getUser(req, res) {
    try {
      const user = await User.find();
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getUserById(req, res) {
    const listIds = req.query.listIds;
    try {
      const users = await User.find({ _id: { $in: listIds } });
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async getOneUser(req, res) {
    try {
      const user = await User.find({ email });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async addUser(req, res) {
    const { selectedUsers } = req.body;
    console.log(selectedUsers);
    try {
      // Find the class by ID
      const classID = req.params.classID;
      const classDocument = await ClassRoom.findById(classID);

      if (!classDocument) {
        return res
          .status(404)
          .json({ success: false, error: "Class not found" });
      }
      console.log(classDocument.studentID);
      // Filter out existing student IDs to avoid duplicates
      const newStudentIDs = selectedUsers.filter(
        (userId) => !classDocument.studentID.includes(userId)
      );

      // Add unique user IDs to the class's studentID array
      classDocument.studentID.push(...newStudentIDs);

      // Save the updated class document
      const result = await classDocument.save();

      res.status(200).json({ success: true, result });
    } catch (error) {
      // console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  async addWaitingStudent(req, res) {
    const { studentID, classID } = req.body;
    console.log(studentID);
    console.log(classID);
    try {
      // Find the class by ID
      // const classID = req.params.classID;
      const classDocument = await ClassRoom.findById(classID);
      console.log(classDocument);
      if (!classDocument) {
        return res
          .status(404)
          .json({ success: false, error: "Class not found" });
      }
      // console.log(classDocument.studentID);
      // Filter out existing student IDs to avoid duplicates
      const theNewStudentIDs = studentID.filter(
        (userId) => !classDocument.studentID.includes(userId)
      );
      if (theNewStudentIDs.length === 0) {
        return res
          .status(200)
          .json({ success: true, error: "Bạn đã tham gia vào lớp học" });
      }
      const newStudentIDs = theNewStudentIDs.filter(
        (userId) => !classDocument.waitingStudents.includes(userId)
      );
      if (newStudentIDs.length === 0) {
        return res.status(200).json({
          success: true,
          error: "Bạn đã yêu cầu, vui lòng đợi giáo viên chấp nhận",
        });
      }
      classDocument.waitingStudents.push(...newStudentIDs);

      // Save the updated class document
      const result = await classDocument.save();

      res.status(200).json({ success: true, result });
    } catch (error) {
      // console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
  async setWaitingStudents(req, res) {
    const { studentID, acceptance, classID } = req.body;
    console.log(studentID);
    console.log(acceptance);
    console.log(classID);
    try {
      const classDocument = await ClassRoom.findById(classID);
      if (acceptance) {
        classDocument.studentID.push(studentID);
        classDocument.waitingStudents = classDocument.waitingStudents.filter(
          (id) => id === studentID
        );
        const result = await classDocument.save();
        res.status(200).json({ success: true, result });
      } else {
        classDocument.waitingStudents = classDocument.waitingStudents.filter(
          (id) => id !== studentID
        );
        res.status(200).json({ success: true, result });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  async updateUserRole(req, res) {
    try {
      const userId = req.params.userId;
      console.log(userId);
      const { role } = req.body;
      console.log(role);
      const updateUserRole = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
      );
      if (!updateUserRole) {
        return res.status(404).json({ error: "Class not found" });
      }

      return res.status(200).json(updateUserRole);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}

module.exports = new AuthController();
