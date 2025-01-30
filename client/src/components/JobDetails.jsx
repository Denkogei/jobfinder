import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/jobs/${id}`);
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
    alert(`You have applied for the job!\nName: ${values.name}\nEmail: ${values.email}`);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
  });

  return (
    <div className="container p-4 mx-auto">
      {job && (
        <>
          <h1 className="text-2xl font-bold text-center mb-4">{job.title}</h1>
          <p className="text-lg text-center text-gray-700 mb-2">{job.company}</p>
          <p className="text-gray-600 text-center mb-2">{job.location}</p>
          <p className="text-gray-500 text-center mb-4">{job.description}</p>

          <div className="application-form bg-white shadow-md rounded-lg p-4 max-w-sm mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-center">Apply for this job</h3>
            <Formik
              initialValues={{ name: '', email: '' }}
              validationSchema={validationSchema}
              onSubmit={handleApply}
            >
              <Form>
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Your Name</label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Your Email</label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-5 rounded-md transition duration-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Apply Now
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </>
      )}
    </div>
  );
}

export default JobDetails;
