import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [jobs, setJobs] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  
  const navigate = useNavigate();

 
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
  const handleApplyClick = (jobId) => {
    navigate(`/job/${jobId}`);  
  };
  return (
    <div className="container p-4 mx-auto h-screen">
    <h1 className="text-center text-2xl font-bold mb-6">Job Finder</h1>
    <p className="text-center mb-8">Explore and apply for jobs.</p>

   
    <div className="card p-8 mx-4 mb-12">
      <div className="job-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12"> 
        {jobs.length === 0 ? (
          <p className="text-center text-gray-600">No jobs available at the moment.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="job-card bg-white shadow-lg p-8 rounded-lg mx-2 my-0 w-[350px] h-[400px] flex flex-col justify-between"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-3">{job.title}</h3>
                <p className="text-gray-700 mb-2">{job.company}</p>
                <p className="text-gray-600 mb-2">{job.location}</p>
              </div>
              <p className="text-gray-500 mb-4 flex-1">{job.description}</p>

              <div className="mt-auto">
              <button
                className="bg-green-600 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-green-400"
                onClick={() => handleApplyClick(job.id)}  
              >
                Apply Now
              </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
      


    );
}

export default Home;
