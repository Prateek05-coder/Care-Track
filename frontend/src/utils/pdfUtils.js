import { jsPDF } from "jspdf";
import axios from "axios";

export const generatePatientPDF = async (patientId) => {
  try {
    if (!patientId) {
      throw new Error("Please enter a valid Patient ID.");
    }
    console.log("Fetching Data for Patient ID:", patientId);
    
    const response = await axios.get(`http://localhost:5000/api/patients?patientId=${patientId}`);
    const patients = response.data;

    if (!patients || patients.length === 0) {
      throw new Error("Patient data not found.");
    }

    const patient = patients[0]; // ✅ Assuming API returns an array

    console.log("Fetched Patient Data:", patient);

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Patient Report", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Patient ID: ${patient.patientId}`, 20, 40);
    doc.text(`Name: ${patient.firstName} ${patient.lastName}`, 20, 50);
    doc.text(`DOB: ${new Date(patient.dob).toLocaleDateString()}`, 20, 60);
    doc.text(`Gender: ${patient.gender}`, 20, 70);
    doc.text(`Phone: ${patient.phone}`, 20, 80);
    doc.text(`Email: ${patient.email}`, 20, 90);
    doc.text(`Address: ${patient.address || "N/A"}`, 20, 100);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Prescriptions:", 20, 120);
    doc.setFont("helvetica", "normal");
    patient.prescriptions.forEach((prescription, index) => {
      doc.text(`${index + 1}. ${prescription}`, 20, 130 + index * 10);
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Visits:", 20, 150 + patient.prescriptions.length * 10);
    doc.setFont("helvetica", "normal");
    patient.visits.forEach((visit, index) => {
      doc.text(`${index + 1}. ${visit}`, 20, 160 + index * 10 + patient.prescriptions.length * 10);
    });

    doc.save(`${patient.firstName}_${patient.lastName}_PatientReport.pdf`);
    alert("Patient data exported successfully!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert(error.message || "Failed to export patient data.");
  }
};