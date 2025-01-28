import React, { useState } from 'react';

function AddJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company_id, setCompanyId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const jobData = { title, description, company_id };

    fetch('http://localhost:5000/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Job added successfully!');
      })
      .catch((error) => {
        console.error('Error adding job:', error);
      });
  };

  return (
    <div>
      <h1>Add New Job</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Job Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Company ID</label>
          <input type="text" value={company_id} onChange={(e) => setCompanyId(e.target.value)} />
        </div>
        <button type="submit">Add Job</button>
      </form>
    </div>
  );
}

export default AddJob;
