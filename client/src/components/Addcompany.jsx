import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const AddCompany = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required("Company name is required"),
    location: Yup.string().required("Location is required"),
    industry: Yup.string().required("Industry is required"),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    fetch("https://jobfinder-g4vi.onrender.com/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        setSuccessMessage("Company added successfully!");
        setSubmitting(false);
        resetForm();
        
      
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((error) => {
        setErrorMessage("Error adding company");
        console.error("Error:", error);
        setSubmitting(false);
      });
  };

  return (
    <div className="container mx-auto max-w-lg p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Add New Company</h1>

      {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>}
      {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

      <Formik
        initialValues={{ name: "", location: "", industry: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Company Name</label>
              <Field
                type="text"
                name="name"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
              <Field
                type="text"
                name="location"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
              <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Industry</label>
              <Field
                type="text"
                name="industry"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
              <ErrorMessage name="industry" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className={`py-2 px-6 rounded-md transition duration-300 ${
                  isSubmitting || !isValid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-400"
                }`}
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? "Adding..." : "Add Company"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
    //comment
  );
};

export default AddCompany;
