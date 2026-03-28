import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import DriverApplicationForm from './components/DriverApplicationForm';
import Login from './components/Login';
import DashBoard from "./components/DashBoard";
import SponsorOrgBoard from "./components/SponsorOrgBoard";
import SponsorUserBoard from "./components/SponsorUserBoard";
import AdminBoard from "./components/AdminBoard";
import CreateAccount from "./components/CreateAccount";
import Catalogue from "./components/Catalogue";
import { AuthProvider, useAuth } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetails from "./components/ProductDetails";
import AdminUsers from "./components/AdminUsers";
import AdminUserDetails from "./components/AdminUserDetails";
import Settings from "./components/Settings"


function AppWrapper() {
  return (
  <AuthProvider>
    <BrowserRouter>
      <AppInner /> {}
    </BrowserRouter>
  </AuthProvider>
);
}

function AppInner() {
  

  const { logout, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="App">
        <nav className="navbar background">
          <ul className="nav-list">
            <div className="logo">
              <img src="/hugo.jpeg" alt="hugo" />
            </div>
            <li>
            < Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/apply">Apply as Driver</Link>
            </li>
              <li>
              <Link to="/catalogue">Catalogue</Link>
              </li>
              {!isAuthenticated ? (
              <li>
                <Link to="/login">Login</Link>
              </li>
              ) : (
                <li>
                  <button className="btn btn-sm" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              )}
          </ul>
          <div className="rightNav">
            <input type="text" name="search" id="search" />
            <button className="btn btn-sm">Search</button>
          </div>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/apply" element={<ProtectedRoute><DriverApplicationForm /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
        <Route path="/orgboard" element={<ProtectedRoute><SponsorOrgBoard/></ProtectedRoute>}/>
        <Route path="/sponsboard" element={<ProtectedRoute><SponsorUserBoard/></ProtectedRoute>}/>
        <Route path="/adboard" element={<ProtectedRoute><AdminBoard/></ProtectedRoute>}/>
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/users/:id" element={<ProtectedRoute><AdminUserDetails /></ProtectedRoute>} />
        <Route path="/catalogue" element={<ProtectedRoute><Catalogue /></ProtectedRoute>} />
        <Route path="/product/:code" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>}
/>
        <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function About() {
  const [posts, setPosts] = React.useState([]);

  useEffect(() => {
    const url = process.env.REACT_APP_ABOUT_URL || 'http://localhost:3001/api/about';
    const fetchAboutData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setPosts(data || []);
        console.log("Fetched about data:", data);
        return response;
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };
    if(fetchAboutData()) {
      console.log("About data fetched successfully.");
    } else {
      console.error("Failed to fetch about data.");
    }
  }, [])
  return (
    <div>
      <section className="about-section">
        <div className="about-container">
          <h1>CocoDinoBytes</h1>

          <div className="about-content">
            <p><strong>Team Number:</strong> {posts?.team_num || "Unknown"}</p>
            <p><strong>Version:</strong> {posts?.version_num || "Unknown"}</p>
            <p><strong>Release Date:</strong> {posts?.release_date || "Unknown"}</p>
            <p><strong>Product Name:</strong> {posts?.product_name || "Unknown"}</p>
            <p><strong>Description:</strong> {posts?.product_desc || "Unknown"}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

export default AppWrapper;
