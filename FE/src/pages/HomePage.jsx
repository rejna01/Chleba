import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/archive");
  };

  return (
    <div>
      <h1>Vítejte na úvodní stránce!</h1>
    </div>
  );
}

export default HomePage;
