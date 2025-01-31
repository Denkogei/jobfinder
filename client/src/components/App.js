import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import About from '../components/About';
import Addjob from '../components/Addjob';
import Home from '../components/Home';
import JobDetails from './JobDetails';
import Addcompany from '../components/Addcompany';
import UpdatJob from './UpdateJob';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  return (
    <Router>
      <div className="pt-[13vh]">
        <Navbar onSearch={handleSearch} />
        <Routes>
          <Route path="/" element={<Home searchTerm={searchTerm} />} />
          <Route path="/add-job" element={<Addjob />} />
          <Route path="/add-company" element={<Addcompany />} />
          <Route path="/about" element={<About />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/update-job/:id" element={<UpdatJob />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
