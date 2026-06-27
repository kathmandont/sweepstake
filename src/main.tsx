
  import { createRoot } from "react-dom/client";
  import { BrowserRouter, Routes, Route } from "react-router";
  import App from "./app/App.tsx";
  import CyclingHome from "./app/cycling/CyclingHome.tsx";
  import TourPage from "./app/cycling/TourPage.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cycling" element={<CyclingHome />} />
        <Route path="/cycling/:tourId" element={<TourPage />} />
      </Routes>
    </BrowserRouter>
  );
