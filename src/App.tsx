import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Templates from "./pages/Templates";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/builder" element={<Dashboard />} />
        <Route path="/builder/:id" element={<Editor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
