import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [jobs, setJobs] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  

 
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        
        const response = await axios.get('http://127.0.0.1:5000/jobs');
        setJobs(response.data);  
      } catch (err) {
        setError(err.message);  
        console.error('Error fetching jobs:', err); 
      } finally {
        setLoading(false); 
      }
    };

    fetchJobs();  
  }, []); 

  
  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container p-4 mx-auto h-screen">
  <h1 className="text-center text-2xl font-bold mb-6">Job Finder</h1>
  <p className="text-center mb-8">Explore and apply for jobs.</p>

  <div className="job-list grid grid-cols-4 gap-4 mx-12">
    {jobs.length === 0 ? (
      <p>No jobs available at the moment.</p>
    ) : (
      jobs.map((job) => (
        <div
          key={job.id}
          className="job-card bg-white shadow-lg p-[40px] rounded-lg mx-4"  
        >
          <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
          <p className="text-gray-700 mb-2">{job.company}</p>
          <p className="text-gray-600 mb-2">{job.location}</p>
          <p className="text-gray-500 mb-4">{job.description}</p>
          <button className="bg-green-600 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-green-400">
            Apply Now
          </button>
        </div>
      ))
    )}
  </div>
</div>



  

)
}

export default Home;
