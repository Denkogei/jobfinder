import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home({ searchTerm }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()))
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
      <header className="relative">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold">Job Finder</div>

          <div className="block lg:hidden">
            <button
              className="text-3xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              &#9776;
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="absolute left-0 top-0 w-full bg-white shadow-md p-4 z-10">
            <ul className="space-y-4 text-center">
              <li><a href="#">Home</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        )}
      </header>

      <div className="mb-6">
        <input
          type="text"
          className="w-full p-3 border rounded-md"
          placeholder="Search jobs..."
        />
      </div>

      <div className="card p-8 mx-4 mb-12">
        <div className="job-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredJobs.length === 0 ? (
            <p className="text-center text-gray-600">No jobs available at the moment.</p>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="job-card bg-white shadow-lg p-6 rounded-lg mx-2 my-4 w-full max-w-[330px] h-[450px] flex flex-col justify-between"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-3">{job.title}</h3>
                  <p className="text-gray-700 mb-2">{job.company}</p>
                  <p className="text-gray-600 mb-2">{job.location}</p>
                </div>
                <p className="text-gray-500 mb-4 flex-1">{job.description}</p>

                <div className="mt-auto flex flex-row gap-4">
                  <button
                    className="bg-green-600 text-white py-3 px-6 rounded-md transition duration-300 hover:bg-green-400 w-full sm:w-auto"
                    onClick={() => handleApplyClick(job.id)}
                  >
                    Apply Now
                  </button>

                  <button
                    className="bg-blue-600 text-white py-3 px-6 rounded-md transition duration-300 hover:bg-blue-400 w-full sm:w-auto"
                    onClick={() => handleUpdateClick(job.id)}
                  >
                    Update
                  </button>

                  <button
                    className="bg-red-600 text-white py-3 px-6 rounded-md transition duration-300 hover:bg-red-400 w-full sm:w-auto"
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
