import React, { useEffect, useState } from 'react';

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A'; // Proper check for invalid date
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
};

const PatientList = ({ patients, onEdit, onDelete, onView }) => {
  const [updatedPatients, setUpdatedPatients] = useState([]);

  useEffect(() => {
    console.log("Patients List Updated:", patients); // Debugging Output
    setUpdatedPatients(patients); // Ensure re-render when patients change
  }, [patients]);

  const getLastVisit = (patient) => {
    if (patient.lastVisit) return formatDate(patient.lastVisit); // Ensure single field works first
    if (!Array.isArray(patient.visits) || patient.visits.length === 0) return 'N/A';

    const sortedVisits = patient.visits
      .map(v => new Date(v.date))
      .filter(d => !isNaN(d.getTime())) // Filter valid dates
      .sort((a, b) => b - a);

    return sortedVisits.length > 0 ? formatDate(sortedVisits[0]) : 'N/A';
  };

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Patient ID</th>
          <th>Name</th>
          <th>Gender</th>
          <th>DOB</th>
          <th>Phone</th>
          <th>Last Visit</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {updatedPatients.length === 0 ? (
        <tr><td colSpan="7">No patients found.</td></tr>
        ) : (
          updatedPatients.map((patient) => (
            <tr key={patient._id}>
              <td>{patient.patientId || 'N/A'}</td>
              <td>{patient.firstName} {patient.lastName}</td>
              <td>{patient.gender}</td>
              <td>{formatDate(patient.dob)}</td>
              <td>{patient.phone}</td>
              <td>{getLastVisit(patient)}</td> {/* Fixed retrieval */}
              <td>
                <button className="btn btn-sm btn-info me-2" onClick={() => onView(patient)}>View</button>
                <button className="btn btn-sm btn-secondary me-2" onClick={() => onEdit(patient)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(patient._id)}>Delete</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default PatientList;