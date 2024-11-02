import React from "react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../services/axios";
import { useAuth } from "../../context/AuthProvider";
import "./login.css";
import class2Image from "../../asset/class2.png";
import class3Image from "../../asset/class3.png";
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  async function handleCallbackResponse(response) {
    var userObject = jwtDecode(response.credential);
    console.log(userObject);
    setUser(userObject);
    const username = userObject.name;
    const email = userObject.email;
    const photoURL = userObject.picture;
    await axios
      .post("auth/signup", {
        username: username,
        email: email,
        photoURL: photoURL,
      })
      .then((response) => {
        console.log("User successfully stored in MongoDB:", response.data);
      })

      .catch((error) => {
        console.error("Error storing user in MongoDB:", error);
      });

    localStorage.setItem("userId", email);
    login(username, email, photoURL);

    document.getElementById("signInDiv").hidden = true;

    navigate("/home");
    window.location.reload();
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }

  useEffect(() => {
    // global google

    const initializeGoogleIdentity = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id:
            "17941385004-l165k961ur66fk68upp6avp8mn8p727v.apps.googleusercontent.com",
          callback: handleCallbackResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("signInDiv"),
          {
            theme: "outline",
            size: "large",
          }
        );
      } else {
        // Retry initialization after a short delay
        setTimeout(initializeGoogleIdentity, 100);
      }
    };

    initializeGoogleIdentity();
  }, []);
  return (
    <div className="Login">

      <div className="header-nav">
        <nav className="navbar">
          <ul className="navbar-nav">
            <li className="nav-item" >
              <img src={class3Image} alt="" className="class3Image" />
            </li>
            {/* <li className="nav-item">
              <div id="signInDiv" className="signInDiv"></div>
            </li> */}
            <ul  className="header-nav-items">
              <li className="nav-item">
                Home
              </li >
              <li className="nav-item">
                Contact
              </li>
              <li className="nav-item">
                About us
              </li >
              <li className="nav-item" >
                {/* sign in */}
              <div id="signInDiv" className="signInDiv"></div>
              </li>

            </ul>
          </ul>
        </nav>
      </div>


      <div className="login-body">
        <img src={class2Image} alt="" className="class2Image" />
      </div>

      {/* { Object.keys(user).length !== 0 && 
            <div>
            <button onClick={(e) => handleSignOut(e)}>Sign Out</button>
            <h3>{ user.name }</h3>
            <img src={ user.picture } alt=""/>
          </div>     
        } */}
    </div>
  );
}
