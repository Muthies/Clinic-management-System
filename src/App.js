import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import ReceptionistDashboard from './ReceptionistDashboard';
import DoctorDashboard from './DoctorDashboard';
import Patients from './Patients';
import PatientGraph from './PatientGraph'; // Import the PatientGraph component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/receptionist" element={<ReceptionistDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/patients" element={<Patients />} /> 
        <Route path="/doctor/graph" element={<PatientGraph />} /> {/* Corrected here */}
      </Routes>
    </Router>
  );
}

export default App;
