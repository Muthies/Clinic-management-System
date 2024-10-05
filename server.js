const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const moment = require('moment'); // For date manipulation

// Initialize express and port
const app = express();
const port = 5000;

// MongoDB URI
const mongoUri = 'mongodb://localhost:27017/clinic_management'; 

// Connect to MongoDB using Mongoose
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Patient Schema
const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  symptoms: String,
  contact: String,
  tokenNo: {
    type: Number,
    unique: true, // Ensure tokenNo is unique
  },
  admissionDate: {
    type: Date,
    default: Date.now, // Automatically set the date of entry
  },
});

// Create a model for the patients collection
const Patient = mongoose.model('Patient', patientSchema);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Helper function to check if two dates are on the same day
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// Route to submit patient details
app.post('/submitPatient', async (req, res) => {
  const { name, age, gender, symptoms, contact } = req.body;

  if (!name || !age || !gender || !symptoms || !contact) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const today = new Date();

    // Find the last patient of today
    const lastPatientToday = await Patient.findOne({
      admissionDate: { $gte: new Date(today.setHours(0, 0, 0, 0)) }
    }).sort({ tokenNo: -1 });

    let newTokenNo = 1; // Start from 1 if no patients exist today

    if (lastPatientToday) {
      newTokenNo = lastPatientToday.tokenNo + 1; // Increment tokenNo by 1
    }

    // Create a new patient entry with the incremented tokenNo
    const newPatient = new Patient({
      name,
      age,
      gender,
      symptoms,
      contact,
      tokenNo: newTokenNo, // Automatically assign the incremented tokenNo
    });

    await newPatient.save();
    res.status(201).json({ message: 'Patient details submitted successfully', tokenNo: newTokenNo });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error for tokenNo
      return res.status(400).json({ error: 'A patient with this tokenNo already exists.' });
    }
    console.error('Error saving patient:', error);
    res.status(500).json({ error: 'Failed to submit patient details' });
  }
});

// Route to fetch all patients (for receptionist dashboard)
app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find().exec();
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Route to fetch today's patients for the doctor dashboard
app.get('/patients/today', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const patients = await Patient.find({
      admissionDate: { $gte: startOfDay, $lt: endOfDay }
    }).exec();

    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching today\'s patients:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s patients' });
  }
});

// Route to update patient details
app.put('/updatePatient/:tokenNo', async (req, res) => {
  const { tokenNo } = req.params;
  const updateData = req.body;

  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { tokenNo }, // Search by tokenNo
      updateData,  // Data to update
      { new: true, runValidators: true } // Return the updated document
    );
    if (!updatedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(200).json({ message: 'Patient details updated successfully', patient: updatedPatient });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Failed to update patient details' });
  }
});

// Route to delete a patient
app.delete('/deletePatient/:tokenNo', async (req, res) => {
  const { tokenNo } = req.params;

  try {
    const deletedPatient = await Patient.findOneAndDelete({ tokenNo });
    if (!deletedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});

// Route to fetch patient data for the past 7 days for a graph
app.get('/patient-graph-data', async (req, res) => {
  try {
    // Get the current date
    const today = moment();
    const lastSevenDays = Array.from({ length: 7 }, (v, i) => today.clone().subtract(i, 'days').startOf('day'));

    // Prepare an array to hold patient counts for the last 7 days
    const patientCounts = await Promise.all(
      lastSevenDays.map(async (date) => {
        const count = await Patient.countDocuments({
          admissionDate: {
            $gte: date.toDate(),
            $lt: date.clone().endOf('day').toDate(),
          },
        });
        return {
          day: date.format('YYYY-MM-DD'), // Format the date for the graph
          patientCount: count,
        };
      })
    );

    // Reverse the array to show data from oldest to newest
    patientCounts.reverse();

    res.status(200).json(patientCounts);
  } catch (error) {
    console.error('Error fetching patient graph data:', error);
    console.error('Error saving patient:', error.message); // Log error message
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Failed to fetch patient graph data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
