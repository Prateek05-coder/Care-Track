import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PatientList from '../components/PatientList';
import PatientModal from '../components/PatientModal';
import PatientDetails from './PatientDetails';

const PAGE_SIZE = 10;

const Patients = () => {
  const [allPatients, setAllPatients] = useState([]); // All patients from backend
  const [patients, setPatients] = useState([]);       // Patients to display (filtered)
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchCondition, setSearchCondition] = useState('');
  const [searchVisitDate, setSearchVisitDate] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);

  // For Last Visit filter input
  const [visitDateInputType, setVisitDateInputType] = useState('text');
  const visitDateInputRef = useRef(null);

  // Helper to format date as dd-mm-yyyy for display
  const formatDDMMYYYY = (dateStr) => {
    if (!dateStr) return ''; // Handle empty input
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return ''; // Ensure valid date

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
};

  // Fetch all patients from backend
  const fetchAllPatients = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/patients');
      setAllPatients(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching patients:', err);
      alert('Error fetching patients.');
      setAllPatients([]);
      setLoading(false);
    }
  };

  // Apply client-side search and backend-like filters
  useEffect(() => {
    let filtered = [...allPatients];

    // Client-side search bar (name, phone, id)
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(p =>
        (p.firstName && p.firstName.toLowerCase().includes(term)) ||
        (p.lastName && p.lastName.toLowerCase().includes(term)) ||
        (p.phone && p.phone.includes(term)) ||
        (p._id && p._id.toLowerCase().includes(term))
      );
    }

    // Filter by condition (if any)
    if (searchCondition.trim()) {
      filtered = filtered.filter(p =>
        p.medicalHistory &&
        p.medicalHistory.condition &&
        p.medicalHistory.condition.toLowerCase().includes(searchCondition.trim().toLowerCase())
      );
    }

    // Filter by visit date (if any)
    if (searchVisitDate) {
      filtered = filtered.filter(p =>
        (p.lastVisit && p.lastVisit.slice(0, 10) === searchVisitDate) ||
        (Array.isArray(p.visits) && p.visits.some(v => v.date && v.date.slice(0, 10) === searchVisitDate))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (sortField === 'firstName' || sortField === 'lastName') {
        aValue = (aValue || '').toLowerCase();
        bValue = (bValue || '').toLowerCase();
      }
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setPatients(filtered);
    setPage(1); // Reset to first page on filter/search change
  }, [allPatients, searchTerm, searchCondition, searchVisitDate, sortField, sortOrder]);

  useEffect(() => {
    fetchAllPatients();
  }, []);

useEffect(() => {
  const fetchPatients = async () => {
    try {
      const response = await fetch(`/api/patients`);
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  fetchPatients();
}, []);
  // Pagination
  const totalPages = Math.max(1, Math.ceil(patients.length / PAGE_SIZE));
  const paginatedPatients = patients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDeletePatient = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/patients/${id}`);
      fetchAllPatients();
      if (selectedPatient && selectedPatient._id === id) setSelectedPatient(null);
    } catch (err) {
      alert('Error deleting patient');
    }
  };

  const handleSavePatient = async (patientData) => {
    const dataToSend = {
      ...patientData,
      lastVisit: patientData.lastVisit ? new Date(patientData.lastVisit) : undefined
    };
    try {
      if (editingPatient) {
        await axios.put(`http://localhost:5000/api/patients/${editingPatient._id}`, dataToSend);
      } else {
        await axios.post('http://localhost:5000/api/patients', dataToSend);
      }
      fetchAllPatients();
      setShowPatientModal(false);
      setEditingPatient(null);
    } catch (err) {
      alert('Error saving patient. Please check all required fields.');
    }
  };

  const updatePatientData = (updatedData) => {
    fetchAllPatients();
    if (selectedPatient && selectedPatient._id === updatedData._id) setSelectedPatient(updatedData);
  };

  // Pagination controls
  const handlePrevPage = () => setPage(page > 1 ? page - 1 : 1);
  const handleNextPage = () => setPage(page < totalPages ? page + 1 : totalPages);

  if (selectedPatient) {
    return (
      <PatientDetails
        patient={selectedPatient}
        onBack={() => setSelectedPatient(null)}
        onUpdatePatient={updatePatientData}
      />
    );
  }

  return (
    <div>
      <h1>Patient Records</h1>
      <h2 style={{ fontSize: '1.5rem' }}>All Patients</h2>
      <div className="d-flex flex-wrap align-items-center mb-3" style={{ gap: 10 }}>
        <input
          type="text"
          placeholder="Search by ID, Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          style={{ width: 200 }}
        />
        <button
          className="btn btn-outline-secondary"
          style={{ marginLeft: 10 }}
          onClick={() => setShowFilters(f => !f)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        <div style={{ flex: 1 }} />
        <button
          className="btn btn-primary"
          style={{ marginLeft: 'auto' }}
          onClick={() => { setEditingPatient(null); setShowPatientModal(true); }}
        >
          Add Patient
        </button>
      </div>
      {showFilters && (
        <div className="mb-3 d-flex flex-wrap align-items-center" style={{ gap: 10 }}>
          <input
            type="text"
            placeholder="Condition"
            value={searchCondition}
            onChange={(e) => setSearchCondition(e.target.value)}
            className="form-control"
            style={{ width: 140 }}
          />
          <input
            ref={visitDateInputRef}
            type={visitDateInputType}
            placeholder="Last Visit"
            value={
              searchVisitDate
                ? (visitDateInputType === 'date'
                    ? searchVisitDate
                    : formatDDMMYYYY(searchVisitDate))
                : ''
            }
            onFocus={() => setVisitDateInputType('date')}
            onBlur={() => {
              if (!searchVisitDate) setVisitDateInputType('text');
            }}
            onChange={e => {
              setSearchVisitDate(e.target.value);
              setVisitDateInputType('date');
            }}
            className="form-control"
            style={{ width: 150 }}
          />
          <select
            className="form-select"
            value={sortField}
            onChange={e => setSortField(e.target.value)}
            style={{ width: 120 }}
          >
            <option value="createdAt">Sort: Newest</option>
            <option value="firstName">Sort: Name</option>
            <option value="dob">Sort: DOB</option>
          </select>
          <select
            className="form-select"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            style={{ width: 110 }}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <PatientList
            patients={paginatedPatients}
            onView={setSelectedPatient}
            onEdit={(patient) => { setEditingPatient(patient); setShowPatientModal(true); }}
            onDelete={handleDeletePatient}
          />
          <div className="d-flex justify-content-between align-items-center mt-2">
            <button className="btn btn-secondary" onClick={handlePrevPage} disabled={page === 1}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button className="btn btn-secondary" onClick={handleNextPage} disabled={page === totalPages}>Next</button>
          </div>
        </>
      )}
      <PatientModal
        show={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        onSave={handleSavePatient}
        patient={editingPatient}
      />
    </div>
  );
};

export default Patients;