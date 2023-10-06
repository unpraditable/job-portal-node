// src/App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import JobList from "./components/JoblList";
import JobDetail from "./components/JobDetail";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("jwtToken") || "");

  const LoginRoute = () => {
    if (token) {
      return <Navigate to="/jobs" replace />;
    }

    return <Login setToken={setToken} />;
  };
  const PrivateRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route
          path="/jobs"
          element={
            <PrivateRoute>
              <JobList />
            </PrivateRoute>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <PrivateRoute>
              <JobDetail />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/jobs" />} />
      </Routes>
    </Router>
  );
};

export default App;
