import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Patients.css';  // Importing the CSS file for styles

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editPatient, setEditPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    axios.get('http://localhost:5000/patients')
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
      });
  };

  const handleDelete = (tokenNo) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      axios.delete(`http://localhost:5000/patients/${tokenNo}`)
        .then(() => {
          alert('Patient deleted successfully');
          setPatients(prevPatients => prevPatients.filter(patient => patient.tokenNo !== tokenNo));
        })
        .catch(error => {
          console.error('Error deleting patient:', error);
        });
    }
  };

  const handleEdit = (patient) => {
    setEditMode(true);
    setEditPatient(patient);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditPatient({
      ...editPatient,
      [name]: value,
    });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/patients/${editPatient.tokenNo}`, editPatient)
      .then(() => {
        alert('Patient updated successfully');
        setPatients(prevPatients =>
          prevPatients.map(patient =>
            patient.tokenNo === editPatient.tokenNo ? editPatient : patient
          )
        );
        setEditMode(false);
        setEditPatient(null);
      })
      .catch(error => {
        console.error('Error updating patient:', error);
      });
  };

  return (
    <div className="patients-container">
      <h3 className="patients-heading">Patient List</h3>

      {editMode && (
        <div className="patients-edit-form">
          <h4>Update Patient Details</h4>
          <form onSubmit={handleUpdateSubmit}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={editPatient?.name || ''}
              onChange={handleInputChange}
              required
            />

            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={editPatient?.age || ''}
              onChange={handleInputChange}
              required
            />

            <label>Gender:</label>
            <select
              name="gender"
              value={editPatient?.gender || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label>Symptoms:</label>
            <textarea
              name="symptoms"
              value={editPatient?.symptoms || ''}
              onChange={handleInputChange}
              required
            />

            <label>Contact:</label>
            <input
              type="text"
              name="contact"
              value={editPatient?.contact || ''}
              onChange={handleInputChange}
              required
            />

            <button type="submit" className="submit-button">Save Changes</button>
            <button type="button" className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
          </form>
        </div>
      )}

      <ul className="patients-list">
        {patients.map((patient, index) => (
          <li key={index} className="patients-list-item">
            {patient.tokenNo}: {patient.name} ({patient.gender}, {patient.age} years) - Symptoms: {patient.symptoms}
            <button className="update-button" onClick={() => handleEdit(patient)}>Update</button>
            <button className="delete-button" onClick={() => handleDelete(patient.tokenNo)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Patients;
