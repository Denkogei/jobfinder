import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false); 

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`https://jobfinder-g4vi.onrender.com/jobs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError('Failed to fetch job details.');
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) {
    return <div>Loading job details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleApply = (values) => {
   
    setApplied(true);
    alert(`You have applied for the job!\nName: ${values.name}\nEmail: ${values.email}`);

   
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
  });

  return (
    <div className="container p-6 mx-auto">
      {job && (
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">{job.title}</h1>
          <div className="text-center mb-6">
            <p className="text-lg font-medium text-gray-700">{job.company}</p>
            <p className="text-gray-600">{job.location}</p>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">{job.description}</p>

          
          {applied && (
            <div className="text-center text-green-500 mb-4">
              <p className="font-semibold">You have successfully applied for this job!</p>
            </div>
          )}

          <div className="application-form bg-gray-50 shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">Apply for this job</h3>
            <Formik
              initialValues={{ name: '', email: '' }}
              validationSchema={validationSchema}
              onSubmit={handleApply}
            >
              <Form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Your Name</label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Your Email</label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-6 rounded-md transition duration-300 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Apply Now
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetails;
