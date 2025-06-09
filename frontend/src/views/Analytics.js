import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Analytics = ({ refreshKey, patients = [] }) => {
  // State for backend analytics
  const [patientsPerCondition, setPatientsPerCondition] = useState([]);
  const [mostPrescribedMedications, setMostPrescribedMedications] = useState([]);
  const [averageAgePerDepartment, setAverageAgePerDepartment] = useState([]);
  const [visitsPerMonth, setVisitsPerMonth] = useState([]);

  // Existing frontend analytics
  const allergyCounts = {};
  const prescriptionCounts = {};
  const conditionCounts = {};

  patients.forEach(patient => {
    if (patient.allergies) {
      const allergies = patient.allergies.split(',').map(a => a.trim());
      allergies.forEach(allergy => {
        allergyCounts[allergy] = (allergyCounts[allergy] || 0) + 1;
      });
    }
    if (patient.prescriptions) {
      patient.prescriptions.forEach(prescription => {
        prescriptionCounts[prescription.medicationName] = (prescriptionCounts[prescription.medicationName] || 0) + 1;
      });
    }
    if (patient.medicalHistory) {
      patient.medicalHistory.forEach(history => {
        conditionCounts[history.condition] = (conditionCounts[history.condition] || 0) + 1;
      });
    }
  });

  // Fetch backend analytics using MongoDB aggregation
  useEffect(() => {
    axios.get("/api/patients/analytics/patients-per-condition")
      .then(res => setPatientsPerCondition(res.data))
      .catch(() => setPatientsPerCondition([]));

    axios.get("/api/patients/analytics/most-prescribed-medications")
      .then(res => setMostPrescribedMedications(res.data))
      .catch(() => setMostPrescribedMedications([]));

    axios.get("/api/patients/analytics/average-age-per-department")
      .then(res => setAverageAgePerDepartment(res.data))
      .catch(() => setAverageAgePerDepartment([]));

    axios.get("/api/patients/analytics/visits-per-month")
      .then(res => setVisitsPerMonth(res.data))
      .catch(() => setVisitsPerMonth([]));
  }, [refreshKey]);

  // Chart.js data
  const conditionBarData = {
    labels: patientsPerCondition.map(item => item._id),
    datasets: [
      {
        label: "Patients per Condition",
        data: patientsPerCondition.map(item => item.count),
        backgroundColor: "#1976d2",
      },
    ],
  };

  const medicationPieData = {
    labels: mostPrescribedMedications.map(item => item._id),
    datasets: [
      {
        label: "Most Prescribed Medications",
        data: mostPrescribedMedications.map(item => item.count),
        backgroundColor: [
          "#1976d2", "#388e3c", "#fbc02d", "#d32f2f", "#7b1fa2", "#0288d1", "#c2185b"
        ],
      },
    ],
  };

  const avgAgeBarData = {
    labels: averageAgePerDepartment.map(item => item._id),
    datasets: [
      {
        label: "Average Age",
        data: averageAgePerDepartment.map(item => item.avgAge && item.avgAge.toFixed ? Number(item.avgAge.toFixed(1)) : item.avgAge),
        backgroundColor: "#388e3c",
      },
    ],
  };

  const visitsBarData = {
    labels: visitsPerMonth.map(item => item._id),
    datasets: [
      {
        label: "Visits per Month",
        data: visitsPerMonth.map(item => item.count),
        backgroundColor: "#fbc02d",
      },
    ],
  };

  return (
    <div id="analyticsView">
      <h1>Analytics</h1>
      <p>View patient demographics, age distribution, common conditions, prescription trends, and allergy statistics.</p>
      <p>Total Patients: {patients.length}</p>

      <div className="analytics-container">
        {/* Patient Demographics */}
        <div className="analytics-card">
          <h2>Patient Demographics</h2>
          <p>Male Patients: {patients.filter(p => p.gender === 'Male').length}</p>
          <p>Female Patients: {patients.filter(p => p.gender === 'Female').length}</p>
          <p>Other Genders: {patients.filter(p => p.gender !== 'Male' && p.gender !== 'Female').length}</p>
        </div>

        {/* Age Distribution */}
        <div className="analytics-card">
          <h2>Age Distribution</h2>
          <p>Under 18: {patients.filter(p => new Date().getFullYear() - new Date(p.dob).getFullYear() < 18).length}</p>
          <p>18-35: {patients.filter(p => {
            const age = new Date().getFullYear() - new Date(p.dob).getFullYear();
            return age >= 18 && age <= 35;
          }).length}</p>
          <p>36-55: {patients.filter(p => {
            const age = new Date().getFullYear() - new Date(p.dob).getFullYear();
            return age >= 36 && age <= 55;
          }).length}</p>
          <p>Over 55: {patients.filter(p => new Date().getFullYear() - new Date(p.dob).getFullYear() > 55).length}</p>
        </div>

        {/* Common Conditions (Frontend) */}
        <div className="analytics-card">
          <h2>Common Conditions</h2>
          {Object.entries(conditionCounts).map(([condition, count]) => (
            <p key={condition}>Condition '{condition}' - {count}</p>
          ))}
        </div>

        {/* Prescription Trends (Frontend) */}
        <div className="analytics-card">
          <h2>Prescription Trends</h2>
          {Object.entries(prescriptionCounts).map(([medication, count]) => (
            <p key={medication}>Prescribed '{medication}' - {count}</p>
          ))}
        </div>

        {/* Allergy Statistics (Frontend) */}
        <div className="analytics-card">
          <h2>Allergy Statistics</h2>
          {Object.entries(allergyCounts).map(([allergy, count]) => (
            <p key={allergy}>Patients with '{allergy}' Allergy - {count}</p>
          ))}
        </div>

        {/* --- MongoDB Aggregation Analytics with Chart.js --- */}
        <div className="analytics-card">
          <h2>Patients per Condition </h2>
          {patientsPerCondition.length > 0 ? (
            <Bar data={conditionBarData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          ) : <p>No data available.</p>}
        </div>

        <div className="analytics-card">
          <h2>Most Prescribed Medications</h2>
          {mostPrescribedMedications.length > 0 ? (
            <Pie data={medicationPieData} options={{ responsive: true }} />
          ) : <p>No data available.</p>}
        </div>

        <div className="analytics-card">
          <h2>Frequency of Visits per Month</h2>
          {visitsPerMonth.length > 0 ? (
            <Bar data={visitsBarData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          ) : <p>No data available.</p>}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
