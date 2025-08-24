import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import SelfHelp from "./Pages/SelfHelp";
import Journal from "./Pages/Journal";
import Chatbot from "./Pages/Chatbot";
import Profile from "./components/Profile";
import OtherUserProfile from "./Pages/OtherUserProfile";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// AuthRedirect component (for handling root path)
const AuthRedirect = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check auth status and load user data on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setIsAuthenticated(true);
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Fixed Navbar */}
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        
        {/* Main Content */}
        <main className="main-content flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
           
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <OtherUserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <SelfHelp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <Chatbot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route with auth check */}
            <Route path="*" element={<AuthRedirect />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;