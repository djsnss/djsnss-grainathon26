import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PageStatic from './pages/PageStatic';
import PageRotating from './pages/PageRotating';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageStatic />} />
        <Route path="/live" element={<PageRotating />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
