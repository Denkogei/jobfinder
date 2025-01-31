import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

const UpdateJob = () => {
  const [job, setJob] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // Get job ID from URL

  // Fetch job details and company list
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobResponse = await fetch(`http://localhost:5000/jobs/${id}`);
        const jobData = await jobResponse.json();
        setJob(jobData);

        const companyResponse = await fetch("http://localhost:5000/companies");
        const companyData = await companyResponse.json();
        setCompanies(companyData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Job title is required"),
    description: Yup.string().required("Job description is required"),
    company_id: Yup.string().required("Please select a company"),
  });

  // Form Submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`http://localhost:5000/jobs/${id}`, {
        method: "PATCH",  // Changed from PUT to PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setSuccessMessage("Job updated successfully!"); // Success message
        setTimeout(() => navigate("/"), 1000); // Redirect after 1 second
      } else {
        console.error("Failed to update job");
      }
    } catch (error) {
      console.error("Error updating job:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center">Loading job details...</div>;
  if (!job) return <div className="text-center text-red-500">Error: Job not found</div>;

  return (
    <div className="container mx-auto max-w-lg p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold text-center mb-4 text-gray-800">Update Job</h1>

      {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>}

      <Formik
        initialValues={{
          title: job.title,
          description: job.description,
          company_id: job.company_id,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Job Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <Field
                type="text"
                name="title"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
              <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Job Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Job Description</label>
              <Field
                as="textarea"
                name="description"
                className="w-full p-4 h-40 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Company Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <Field
                as="select"
                name="company_id"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="company_id" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-500 transition"
              >
                {isSubmitting ? "Updating..." : "Update Job"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdateJob;
