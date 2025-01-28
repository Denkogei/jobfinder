import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import About from '../components/About';
import Addjob from '../components/Addjob';
import Home from '../components/Home';


function App() {
  const [searchTerm, setSearchTerm] = useState('');

  // Handle search term change
  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());  // Update the search term
  };

  return (
    <Router>
      <div>
        <Navbar onSearch={handleSearch} />
        <Routes>
          <Route path="/" element={<Home searchTerm={searchTerm} />} />
          <Route path="/add-job" element={<Addjob />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
