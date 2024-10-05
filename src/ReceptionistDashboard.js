import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ReceptionistDashboard.css'; // Assuming you have this CSS file for styles
import image from './image copy.png'; // Your image path

const ReceptionistDashboard = () => {
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    symptoms: '',
    contact: ''
  });

  const [patients, setPatients] = useState([]);
  const [showPatientList, setShowPatientList] = useState(false);

  const navigate = useNavigate(); // Initialize navigate

  // Fetch all patients when the component loads
  useEffect(() => {
    fetchPatients();
  }, []);

  // Fetch all patients from the server
  const fetchPatients = () => {
    axios.get('http://localhost:5000/patients')
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
      });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData({
      ...patientData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/submitPatient', patientData)
      .then(response => {
        alert('Patient details submitted successfully');
        // Clear form after submission
        setPatientData({ name: '', age: '', gender: '', symptoms: '', contact: '' });
        // Reload patient list
        fetchPatients();
      })
      .catch(error => {
        console.error('Error submitting patient:', error);
        alert('Failed to submit patient details');
      });
  };

  // Handle delete patient
  const handleDelete = (tokenNo) => {
    axios.delete(`http://localhost:5000/patients/${tokenNo}`)
      .then(() => {
        alert('Patient deleted successfully');
        fetchPatients();
      })
      .catch(error => {
        console.error('Error deleting patient:', error);
      });
  };

  // Handle update patient (This can be implemented with an update form)
  const handleUpdate = (tokenNo) => {
    // Here you can add logic to update a patient's details
    alert(`Update patient with Token No: ${tokenNo}`);
  };

  return (
    <div className="receptionist-background">
      <h2 className="receptionist-heading">Receptionist Dashboard</h2>
      <button 
        className="view-patients-button" 
        onClick={() => navigate('/patients')}  // Navigate to the /patients page
      >
        View Patient List
      </button>
      {/* Form for submitting patient details */}
      <div className="receptionist-container">
        <img src={image} alt="Reception" className="receptionist-image" />
        <form className="receptionist-form" onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" name="name" value={patientData.name} onChange={handleInputChange} required />

          <label>Age:</label>
          <input type="number" name="age" value={patientData.age} onChange={handleInputChange} required />

          <label>Gender:</label>
          <select name="gender" value={patientData.gender} onChange={handleInputChange} required>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Symptoms:</label>
          <textarea name="symptoms" value={patientData.symptoms} onChange={handleInputChange} required />

          <label>Contact:</label>
          <input type="text" name="contact" value={patientData.contact} onChange={handleInputChange} required />

          <button className="submitbutton" type="submit">Submit Patient Details</button>
        </form>
      </div>

      {/* Button to view patient list */}
     

      {/* Display patient list with delete and update options */}
      {showPatientList && (
        <div className="patient-list">
          <h3>Patient List</h3>
          <ul>
            {patients.map((patient, index) => (
              <li key={index}>
                {patient.tokenNo}: {patient.name} ({patient.gender}, {patient.age} years) - Symptoms: {patient.symptoms}
                <button className="update-button" onClick={() => handleUpdate(patient.tokenNo)}>Update</button>
                <button className="delete-button" onClick={() => handleDelete(patient.tokenNo)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Button to navigate to the /patients page */}
      
    </div>
  );
};

export default ReceptionistDashboard;
