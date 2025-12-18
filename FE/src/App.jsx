import { Route, Routes, Navigate } from "react-router-dom";

import Layout from "./layout/LayoutIndex";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import DND_Denik from "./dnd/DND_Denik.jsx";
import DND_Help from "./dnd/DND_Help.jsx";

function App() {
  return (
    <Routes>
      <Route path="dnd/:char" element={<DND_Denik />} />
      <Route path="dnd2" element={<DND_Help />} />
      <Route path="/" element={<Navigate to="/dnd/dummy" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
