import React, { useEffect, useState } from "react";
import "./settings.css";
import { useApp } from "../../context/AppProvider";
import { Button } from "antd";
import axios from "../../services/axios";
export default function Settings() {
  const {
    handleChangeSidebarColors,
    sidebarColor,
    headerColor,
    handleChangeHeaderColors,
    loginnedUserId,
  } = useApp();
  const [thisSidebarColor, setThisSidebarColor] = useState(sidebarColor);
  const [thisHeaderColor, setThisHeaderColor] = useState(headerColor);
  // useEffect(() => {
  //     // if(sidebarColor){
  //     //     thisSidebarColor
  //     // }
  //     thisSidebarColor = sidebarColor;
  // },[])

  const saveSidebarColor = async () => {
    handleChangeSidebarColors(thisSidebarColor);
    const colorData = {
        userID: loginnedUserId._id,
        sidebarColor: thisSidebarColor,
        headerColor: thisHeaderColor
    }
    await axios.post('colors/createColors', colorData).then(() => {
        alert('them mau thanh cong')
    }).catch(err => {
        alert('them mau khong thanh cong')
    })
  };
  const handleChangeColor = (e) => {
    setThisSidebarColor(e.target.value);
    handleChangeSidebarColors(e.target.value);
  };

  const handleChangeThisHeaderColor = (e) => {
    setThisHeaderColor(e.target.value);
    handleChangeHeaderColors(e.target.value);
  };
  return (
    <div className="settings-container">
      <div className="settings-content" >
        <div style={{position:'absolute', bottom:'10px', right:'0'}}>
            <Button onClick={() => saveSidebarColor()} >Lưu thay đổi</Button>
         </div>
        <div style={{fontSize:" 30px", fontWeight:"inherit"}}>Cài đặt chung</div>
        <div className="settings-items">
          <p>Chỉnh màu cho thanh Sidebar</p>
          <div className="color-picker">
            <input
              type="color"
              value={thisSidebarColor}
              onChange={handleChangeColor}
              style={{ border: "1px solid black" }}
            />
            <div
              className="color-indicator"
              style={{ backgroundColor: thisSidebarColor }}
              onClick={() => {
                const newColor = prompt(
                  "Enter a new color (hexadecimal or RGB):"
                );
                if (newColor) {
                  setThisSidebarColor(newColor);
                }
              }}
            ></div>
          </div>
        </div>
        <div className="settings-items">
          <p>Chỉnh màu cho thanh Header</p>
          <div className="color-picker">
            <input
              type="color"
              value={thisHeaderColor}
              onChange={handleChangeThisHeaderColor}
              style={{ border: "1px solid black" }}
            />
            <div
              className="color-indicator"
              style={{ backgroundColor: thisHeaderColor }}
              onClick={() => {
                const newColor = prompt(
                  "Enter a new color (hexadecimal or RGB):"
                );
                if (newColor) {
                  setThisHeaderColor(newColor);
                }
              }}
            ></div>
          </div>
        </div>
        <div>
          <p>Lưu lại những thay đổi của bạn</p>
        </div>

      </div>
    </div>
  );
}
