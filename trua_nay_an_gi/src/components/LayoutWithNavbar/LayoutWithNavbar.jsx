import React from "react";
import NavbarWeb from "../Navigate/NavbarWeb";
import Footer from "../Footer/Footer";
import BackToTop from "../backtotop/BackToTop";
import { Outlet } from "react-router-dom";

const LayoutWithNavbar = () => {
  return (
    <div className="App">
      <NavbarWeb />
      <Outlet />
      <BackToTop />
      <Footer />
    </div>
  );
};

export default LayoutWithNavbar;
