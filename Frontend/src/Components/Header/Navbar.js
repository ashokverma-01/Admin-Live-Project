import React from "react";
import "./navbar.scss";
import { FaCar } from "react-icons/fa";
import { Notifications } from "@mui/icons-material";
import Logout from "../../Pages/Logout";
function Navbar() {
  return (
    <div className="navbar">
      <div className="navwrapper">
        <div
          className="topLeft"
          style={{
            width: "246px",
            height: "60px",
            backgroundColor: "rgb(236, 29, 38)",
          }}
        >
          <span className="logo">
            <h2 style={{ marginLeft: "20px" }}>Taxi</h2>
            <FaCar
              style={{
                width: "30px",
                height: "30px",
                marginLeft: "15px",
                marginTop: "15px",
              }}
            />
            <h2 style={{ marginLeft: "15px" }}>Pulse</h2>
          </span>
        </div>
        <div className="topRight">
          <div className="topIconcontainer">
            <Notifications style={{ color: "red" }} />
          </div>
          <Logout />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
