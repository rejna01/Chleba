import { Link } from "react-router-dom";
import React, { useState } from "react";
import Styles from "./Foooter.module.css";

export default function Header() {
  return (
    <footer className={Styles.footer}>
      <p>&copy; 2025 Rejna</p>
      <a href="http://www.skautiprachatice.cz/" target="_blank">
        <img className="footerSkaut" src="/SKAUT_znak.png"></img>
      </a>
    </footer>
  );
}
