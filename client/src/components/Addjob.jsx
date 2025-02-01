import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const AddJob = () => {
  const [companies, setCompanies] = useState([]); 
  const [loading, setLoading] = useState(true);  
  const [successMessage, setSuccessMessage] = useState(null);  
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate(); 

 
  useEffect(() => {
    fetch("https://jobfinder-g4vi.onrender.com/companies")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched companies data:", data);  
        
        if (Array.isArray(data)) {
          setCompanies(data);
        } else {
          console.error("Error: data fetched is not an array", data);
          setCompanies([]);  
        }
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
        setCompanies([]);
      })
      .finally(() => {
        setLoading(false);  
      });
  }, []);  

 
  const validationSchema = Yup.object({
    title: Yup.string().required("Job title is required"),
    description: Yup.string().required("Job description is required"),
    company_id: Yup.string().required("Please select a company"),
  });

  // Handle form submission
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    fetch("https://jobfinder-g4vi.onrender.com/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then(() => {
        setSuccessMessage("Job added successfully!");  
        resetForm();
        setSubmitting(false);

        setRedirecting(true);
        setTimeout(() => {
          navigate("/");  
        }, 1000);
      })
      .catch((error) => {
        console.error("Error adding job:", error);
        setSubmitting(false);
      });
  };

  return (
    <div className="container mx-auto max-w-lg p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Add New Job</h1>

      {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>}

      <Formik
        initialValues={{ title: "", description: "", company_id: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
           
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Job Title</label>
              <Field
                type="text"
                name="title"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
              <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
            </div>

          
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Job Description</label>
              <Field
                as="textarea"
                name="description"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
            </div>

           
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Company</label>
              <Field
                as="select"
                name="company_id"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              >
                {loading ? (
                  <option>Loading...</option>  
                ) : companies.length === 0 ? (
                  <option>No companies available</option>  
                ) : (
                  companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))
                )}
              </Field>
              <ErrorMessage name="company_id" component="div" className="text-red-500 text-sm" />
            </div>

           
            <div className="text-center">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-6 rounded-md transition duration-300 hover:bg-green-400"
                disabled={isSubmitting || companies.length === 0}  
              >
                {isSubmitting ? "Adding..." : "Add Job"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {redirecting && <div className="text-center text-gray-600 mt-4">Redirecting to homepage...</div>}
    </div>
  );
};

export default AddJob;
