import { Route, Routes } from "react-router-dom";

import Layout from "./layout/LayoutIndex";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import DND_Denik from "./pages/DND_Denik.jsx";

function App() {
  return (
    <Routes>
      <Route path="dnd" element={<DND_Denik />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
