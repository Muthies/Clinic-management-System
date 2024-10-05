import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodayPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patients');
        setPatients(response.data);
      } catch (error) {
        setError('Failed to fetch patients');
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayPatients();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (patients.length === 0) {
    return <div>No patients for today.</div>;
  }

  return (
    <div className="doctor-dashboard">
      <h2>Today's Patients</h2>
      {/* Button to view the graph */}
      <Link to="/doctor/graph">
  <button className="view-graph-button">View Patient Graph</button>
</Link>
      <table>
        <thead>
          <tr>
            <th>Token No</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Symptoms</th>
            <th>Contact</th>
            <th>Admission Date</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.tokenNo}>
              <td>{patient.tokenNo}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>{patient.symptoms}</td>
              <td>{patient.contact}</td>
              <td>{new Date(patient.admissionDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default DoctorDashboard;
