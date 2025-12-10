import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", margin: "0px", padding: "10px" }}>
      <h1>404 - Stránka nenalezena</h1>
      <p>Omlouváme se, ale stránka, kterou hledáte, neexistuje.</p>
      <button onClick={() => navigate(-1)}>Zpět</button>
    </div>
  );
}
