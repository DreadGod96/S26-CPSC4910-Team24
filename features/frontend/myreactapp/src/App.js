import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import DriverApplicationForm from './components/DriverApplicationForm';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav className="navbar background">
          <ul className="nav-list">
            <div className="logo">
              <img src="/hugo.jpeg" alt="hugo" />
            </div>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/apply">Apply as Driver</a>
            </li>
          </ul>
          <div className="rightNav">
            <input type="text" name="search" id="search" />
            <button className="btn btn-sm">Search</button>
          </div>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/apply" element={<DriverApplicationForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function About() {
  const [posts, setPosts] = React.useState([]);
  const url = 'http://localhost:3001/api/about';

  useEffect(() => {
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

export default App;