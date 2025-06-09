const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  medicationName: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  notes: String
}, { _id: false });

const VisitSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  reason: { type: String, required: true },
  diagnosis: String,
  treatment: String,
  notes: String
}, { _id: false });

const MedicalHistorySchema = new mongoose.Schema({
  condition: String
}, { _id: false });

const PatientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  address: String,
  allergies: String,
  medications: String,
  prescriptions: [PrescriptionSchema],
  visits: [VisitSchema],
  medicalHistory: MedicalHistorySchema,
  lastVisit: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);