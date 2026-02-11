import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';


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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}


function About() {
  return (
    <div>
      <section className="about-section">
        <div className="about-container">
          <h1>CocoDinoBytes</h1>

          <div className="about-content">
            <h2>Our Team</h2>
            <p>1. Emma Abraham</p>
            <p>2. Ryan Beck</p>
            <p>3. Eli Monroe</p>
            <p>4. Nolen Schnabel</p>
            <p>5. Sarah Tetterton</p>
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