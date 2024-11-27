import React from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import Navbar from "../Components/Header/Navbar";

import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Sidebar />
        <div className="others">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
