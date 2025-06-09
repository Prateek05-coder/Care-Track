const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getPatientById);
router.post('/', patientController.createPatient);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);
router.post('/:id/medical-history', patientController.addMedicalHistory);
router.post('/:id/visits', patientController.addVisit);
router.post('/:id/prescriptions', patientController.addPrescription);

router.get('/analytics/patients-per-condition', patientController.patientsPerCondition);
router.get('/analytics/most-prescribed-medications', patientController.mostPrescribedMedications);
router.get('/analytics/average-age-per-department', patientController.averageAgePerDepartment);
router.get('/analytics/visits-per-month', patientController.visitsPerMonth);
router.get('/advanced-search', patientController.advancedSearch);

module.exports = router;