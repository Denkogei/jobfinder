import React, { useState } from 'react'; 
import { Link, NavLink } from 'react-router-dom';

function Navbar({ onSearch }) { 
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => { 
    setSearchTerm(e.target.value); 
  };

  const handleSearchClick = () => { 
    onSearch(searchTerm); 
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') { 
      onSearch(searchTerm); 
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><NavLink to="/add-job">Add Job</NavLink></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </div>
      <div className="navbar-right">
        <div className="search-container">
          <div className='input'>
            <input
              type="text"
              placeholder="Search for Job..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className='submit'>
            <button
              type="button" 
              className="search-button"
              onClick={handleSearchClick} 
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
