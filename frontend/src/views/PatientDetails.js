import React, { useState, useEffect } from 'react';
import PrescriptionModal from '../components/PrescriptionModal';
import VisitModal from '../components/VisitModal';

const API_URL = '/api/patients';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const getAge = (dob) => {
  if (!dob) return '';
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const PatientDetails = ({ patient, onBack, onUpdatePatient }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ ...patient });

  // Prescriptions and Visits state
  const [prescriptions, setPrescriptions] = useState(patient.prescriptions || []);
  const [visits, setVisits] = useState(patient.visits || []);

   // Triggers when a new patient is viewed

  // Handle Prescription Save
  const handleSavePrescription = async (data) => {
    let updated;
    if (editingPrescription !== null) {
      updated = prescriptions.map((p, idx) =>
        idx === editingPrescription ? { ...p, ...data } : p
      );
    } else {
      updated = [...prescriptions, data];
    }
    console.log("Sending Prescription Data to Backend:", updated); // ✅ Debugging Output

  setPrescriptions(updated);
  setShowPrescriptionModal(false);
  setEditingPrescription(null);

  await onUpdatePatient({ ...patient, prescriptions: updated });
};

  // Handle Visit Save
  const handleSaveVisit = async (data) => {
    let updated = visits ? [...visits, data] : [data];
    if (editingVisit !== null) {
      updated = visits.map((v, idx) =>
        idx === editingVisit ? { ...v, ...data } : v
      );
    } else {
      updated = [...visits, data];
    }
    console.log("Sending Visit Data to Backend:", updated); 

  setVisits(updated);
  setShowVisitModal(false);
  setEditingVisit(null);

 try {
    const response = await onUpdatePatient({ ...patient, visits: updatedVisits }); // ✅ Properly assign response
    console.log("Backend Response:", response); // ✅ Debugging Output
  } catch (error) {
    console.error("Error saving visit:", error);
  }
};



useEffect(() => {
    if (!patient || !patient._id) return;
  const fetchPatientDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/patients/${patient._id}`);
      
      if (!response.ok) {
        throw new Error("No patient data received.");

      }
      console.log("Fetched Patient Data:", response.data);
      
      setEditForm(data); // Ensure the patient data updates
      setPrescriptions(data.prescriptions || []); // Load latest prescriptions
      setVisits(data.visits || []); // Load latest visits
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  fetchPatientDetails();
}, [patient._id]);
  // Handle Delete Prescription
  const handleDeletePrescription = (idx) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      setPrescriptions(prescriptions.filter((_, i) => i !== idx));
    }
  };

  // Handle Delete Visit
  const handleDeleteVisit = (idx) => {
    if (window.confirm('Are you sure you want to delete this visit?')) {
      setVisits(visits.filter((_, i) => i !== idx));
    }
  };

  // Edit Patient Data
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdatePatient(editForm);
    setEditMode(false);
  };

  // Detect dark theme (basic, can be improved with context or props)
  const isDarkTheme = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <div>
      <button className="btn btn-outline-secondary mb-2" onClick={onBack}>← Back to Patients</button>
      <div style={{ height: '1rem' }} /> {/* Line space below back button */}
      <div className="mb-2">
        <h2
          style={{
            marginBottom: 0,
            color: isDarkTheme ? '#fff' : undefined
          }}
        >
          {patient.firstName} {patient.lastName}
        </h2>
        <div
          style={{
            color: isDarkTheme ? '#fff' : '#666',
            fontSize: '1.1rem',
            marginBottom: 0
          }}
        >
          {patient.patientId} &nbsp;|&nbsp; {patient.gender} &nbsp;|&nbsp; {getAge(patient.dob)} years
        </div>
      </div>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Medical History</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'visits' ? 'active' : ''}`} onClick={() => setActiveTab('visits')}>Visits</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'prescriptions' ? 'active' : ''}`} onClick={() => setActiveTab('prescriptions')}>Prescriptions</button>
        </li>
      </ul>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <h5>Contact Information</h5>
          <div className="mb-2">
            <b>Phone:</b> {patient.phone}
          </div>
          <div className="mb-2">
            <b>Email:</b> {patient.email}
          </div>
          <div className="mb-2">
            <b>Address:</b> {patient.address}
          </div>
          <h5>Allergies</h5>
          <div className="mb-2">
            {patient.allergies ? patient.allergies : <span>No allergies listed.</span>}
          </div>
          <h5>Current Medications</h5>
          <div className="mb-2">
            {patient.medications ? patient.medications : <span>No current medications listed.</span>}
          </div>
          <button
            className="btn btn-primary mt-2"
            style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
            onClick={() => setEditMode(true)}
          >
            Edit Data
          </button>
          {editMode && (
            <form className="mt-3" onSubmit={handleEditSubmit}>
              <div className="mb-2">
                <label>First Name *</label>
                <input type="text" className="form-control" name="firstName" value={editForm.firstName} onChange={handleEditChange} required />
              </div>
              <div className="mb-2">
                <label>Last Name *</label>
                <input type="text" className="form-control" name="lastName" value={editForm.lastName} onChange={handleEditChange} required />
              </div>
              <div className="mb-2">
                <label>Date of Birth *</label>
                <input type="date" className="form-control" name="dob" value={editForm.dob ? editForm.dob.split('T')[0] : ''} onChange={handleEditChange} required />
              </div>
              <div className="mb-2">
                <label>Gender *</label>
                <select className="form-control" name="gender" value={editForm.gender} onChange={handleEditChange} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-2">
                <label>Phone Number *</label>
                <input type="text" className="form-control" name="phone" value={editForm.phone} onChange={handleEditChange} required />
              </div>
              <div className="mb-2">
                <label>Email *</label>
                <input type="email" className="form-control" name="email" value={editForm.email} onChange={handleEditChange} required />
              </div>
              <div className="mb-2">
                <label>Address</label>
                <input type="text" className="form-control" name="address" value={editForm.address} onChange={handleEditChange} />
              </div>
              <div className="mb-2">
                <label>Allergies</label>
                <input type="text" className="form-control" name="allergies" value={editForm.allergies} onChange={handleEditChange} />
              </div>
              <div className="mb-2">
                <label>Current Medications</label>
                <input type="text" className="form-control" name="medications" value={editForm.medications} onChange={handleEditChange} />
              </div>
              <button type="button" className="btn btn-secondary me-2" onClick={() => setEditMode(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </form>
          )}
        </div>
      )}

      {/* Medical History Tab */}
      {activeTab === 'history' && (
        <div>
          <h5>Medical History</h5>
          {patient.medicalHistory && patient.medicalHistory.condition ? (
            <ul>
              <li><b>Condition:</b> {patient.medicalHistory.condition}</li>
            </ul>
          ) : (
            <p>No medical history available.</p>
          )}
        </div>
      )}

      {/* Visits Tab */}
      {activeTab === 'visits' && (
        <div>
          <h5 style={{ fontSize: '1.1rem' }}>Patient Visits</h5>
          <button className="btn btn-primary btn-sm mb-2" onClick={() => { setEditingVisit(null); setShowVisitModal(true); }}>
            Add Visit
          </button>
          {visits.length === 0 ? (
            <p>No visits found.</p>
          ) : (
            <ul className="list-group">
              {visits.map((visit, idx) => (
                <li key={idx} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <b>Routine Checkup</b> <span className="ms-2">{formatDate(visit.date)}</span><br />
                      <small>
                        <b>Reason:</b> {visit.reason} <br />
                        {visit.diagnosis && <><b>Diagnosis:</b> {visit.diagnosis} <br /></>}
                        {visit.treatment && <><b>Treatment:</b> {visit.treatment} <br /></>}
                        {visit.notes && <><b>Notes:</b> {visit.notes}</>}
                      </small>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-secondary me-1" onClick={() => { setEditingVisit(idx); setShowVisitModal(true); }}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteVisit(idx)}>Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <VisitModal
            show={showVisitModal}
            onClose={() => { setShowVisitModal(false); setEditingVisit(null); }}
            onSave={handleSaveVisit}
            visit={editingVisit !== null ? visits[editingVisit] : null}
          />
        </div>
      )}

      {/* Prescriptions Tab */}
      {activeTab === 'prescriptions' && (
        <div>
          <h5 style={{ fontSize: '1.1rem' }}>Prescriptions</h5>
          <button className="btn btn-primary btn-sm mb-2" onClick={() => { setEditingPrescription(null); setShowPrescriptionModal(true); }}>
            Add Prescription
          </button>
          {prescriptions.length === 0 ? (
            <p>No prescriptions found.</p>
          ) : (
            <ul className="list-group">
              {prescriptions.map((pres, idx) => (
                <li key={idx} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <b>{pres.medicationName}</b> ({pres.dosage}, {pres.frequency})<br />
                      <small>
                        {formatDate(pres.startDate)} to {formatDate(pres.endDate)}
                        {pres.notes && <> | Notes: {pres.notes}</>}
                      </small>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-secondary me-1" onClick={() => { setEditingPrescription(idx); setShowPrescriptionModal(true); }}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeletePrescription(idx)}>Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <PrescriptionModal
            show={showPrescriptionModal}
            onClose={() => { setShowPrescriptionModal(false); setEditingPrescription(null); }}
            onSave={handleSavePrescription}
            prescription={editingPrescription !== null ? prescriptions[editingPrescription] : null}
          />
        </div>
      )}
    </div>
  );
};

export default PatientDetails;