import React from 'react';

function About() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-green-600 text-center mb-4">About Job Finder</h1>
      <p className="text-lg text-gray-700 leading-relaxed text-center">
        <span className="font-semibold">Job Finder</span> is a platform that connects 
        <span className="text-green-600 font-medium"> job seekers</span> with 
        <span className="text-green-600 font-medium"> employers</span>. You can browse, apply, and 
        post jobs easily.
      </p>
      {/* comment */}
    </div>
  );
}

export default About;
