import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ReaderPage from "./pages/ReaderPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <div className="header">
          <Link to="/"><h2>小说阅读器demo</h2></Link>
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reader/:bookId" element={<ReaderPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
