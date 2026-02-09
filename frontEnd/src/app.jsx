import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect / to /login */}
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
