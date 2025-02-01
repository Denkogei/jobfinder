import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home({ searchTerm }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("https://jobfinder-g4vi.onrender.com/jobs");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        setError("Unable to load jobs at this time. Please try again later.");
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter((job) =>
      (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.company && job.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.location && job.location.toLowerCase().includes(searchTerm.toLowercase()))
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const handleApplyClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const handleUpdateClick = (jobId) => {
    navigate(`/update-job/${jobId}`);
  };

  const handleDeleteClick = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const response = await fetch(`https://jobfinder-g4vi.onrender.com/jobs/${jobId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete job");
        }
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
        setFilteredJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      } catch (err) {
        console.error("Error deleting job:", err);
        alert("Failed to delete job. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin text-green-600 w-12 h-12 border-t-4 border-b-4 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container p-4 mx-auto h-screen">
      <h1 className="text-center text-2xl font-bold mb-6">Job Finder</h1>
      <p className="text-center mb-8">Explore and apply for jobs.</p>

      <div className="card p-8 mx-4 mb-12">
        <div className="job-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredJobs.length === 0 ? (
            <p className="text-center text-gray-600">No jobs available at the moment.</p>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="job-card bg-white shadow-lg p-6 rounded-lg mx-2 my-4 w-full max-w-[380px] h-[500px] flex flex-col justify-between transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/30"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-3">{job.title}</h3>
                  <p className="text-gray-700 mb-2">{job.company}</p>
                  <p className="text-gray-600 mb-2">{job.location}</p>
                </div>
                <p className="text-gray-500 mb-4 flex-1">{job.description}</p>

                <div className="mt-auto flex gap-3 justify-between">
                  <button
                    className="bg-green-600 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-green-400 w-[30%]"
                    onClick={() => handleApplyClick(job.id)}
                  >
                    Apply Now
                  </button>

                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-blue-400 w-[30%]"
                    onClick={() => handleUpdateClick(job.id)}
                  >
                    Update
                  </button>

                  <button
                    className="bg-red-600 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-red-400 w-[30%]"
                    onClick={() => handleDeleteClick(job.id)}
                  >
                    Delete
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
