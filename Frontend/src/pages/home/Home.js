import React, { useState, useRef, useEffect } from "react";
import { Row, Col } from "antd";
import Header from "../../components/header/Header";
import SideBar from "../../components/sidebar/SideBar";
import Body from "../../components/body/Body";
import { useApp } from "../../context/AppProvider";
import CircularProgress from "@mui/material/CircularProgress";
import "../home/home.css";
import chatbotImage from "../../asset/chatbotImage.png";
export default function Home() {
  const { loginnedUserId, sidebarColor } = useApp();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  // const [open]
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Send message to backend API
    try {
      const response = await fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from server");
      }

      const responseData = await response.json();
      const botResponse = responseData.response;

      // Update messages state with user and bot messages
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputMessage, sender: "user" },
        { text: botResponse, sender: "bot" },
      ]);
      setInputMessage("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const [isActive, setIsActive] = useState(false); // State to track chat visibility

  const toggleChat = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="home">
      {!sidebarColor && (
        <CircularProgress style={{ height: "100%", marginTop: "400px" }} />
      )}
      {sidebarColor && (
        <>
          <Row span={24}>
            <Col span={24}>
              <Header isOpen={isSidebarOpen} onClose={toggleSidebar}></Header>
            </Col>
            <Col span={24} className="home-container">
              <SideBar isOpen={isSidebarOpen} onClose={toggleSidebar}></SideBar>
              <Body isOpen={isSidebarOpen}></Body>
            </Col>
            <Col span={24}></Col>
          </Row>
          <Row></Row>
        </>
      )}

      <div className="ChatBot">
        <div className={`chat-container ${isActive ? "active" : ""}`}>
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={inputMessage}
              onChange={handleInputChange}
            />
            <button style={{marginLeft:"20px"}} onClick={sendMessage}>Gửi</button>
          </div>
        </div>
        <div className="show-hide-icon" onClick={toggleChat}>
          <img src={chatbotImage} alt="Show/Hide Chat" />
        </div>
      </div>
    </div>
  );
}
