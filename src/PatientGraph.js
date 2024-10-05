import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './PatientGraph.css';

const PatientGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patient-graph-data');
        console.log(response.data);
        setData(response.data);  // Ensure the API returns the correct format for your graph
      } catch (error) {
        console.error('Error fetching patient graph data:', error);
      }
    };

    fetchPatientData();
  }, []);

  return (
    <div className="patient-graph">
      <h2>Patient Registrations Over the Last 7 Days</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="patientCount" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PatientGraph;
