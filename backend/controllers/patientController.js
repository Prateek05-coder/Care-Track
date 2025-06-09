const Patient = require('../models/Patient');

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPatient = async (req, res) => {
  try {
    // Check for existing email or phone before creating
    const existing = await Patient.findOne({
      $or: [
        { email: req.body.email },
        { phone: req.body.phone }
      ]
    });

    if (existing) {
      if (existing.email === req.body.email && existing.phone === req.body.phone) {
        return res.status(400).json({ message: 'A patient with this email and phone number already exists.' });
      }
      if (existing.email === req.body.email) {
        return res.status(400).json({ message: 'A patient with this email already exists.' });
      }
      if (existing.phone === req.body.phone) {
        return res.status(400).json({ message: 'A patient with this phone number already exists.' });
      }
    }

    // Generate patientId as before
    const lastPatient = await Patient.findOne({}).sort({ createdAt: -1 });
    let nextId = 1001;
    if (lastPatient && lastPatient.patientId) {
      const lastNum = parseInt(lastPatient.patientId.replace('PT', ''), 10);
      if (!isNaN(lastNum)) nextId = lastNum + 1;
    }
    const patientId = `PT${nextId}`;

    const patient = new Patient({ ...req.body, patientId });
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    if (err.code === 11000) {
      const fields = Object.keys(err.keyPattern);
      if (fields.includes('email') && fields.includes('phone')) {
        return res.status(400).json({ message: 'A patient with this email and phone number already exists.' });
      }
      if (fields.includes('email')) {
        return res.status(400).json({ message: 'A patient with this email already exists.' });
      }
      if (fields.includes('phone')) {
        return res.status(400).json({ message: 'A patient with this phone number already exists.' });
      }
      return res.status(400).json({ message: 'A patient with this information already exists.' });
    }
    res.status(400).json({ message: err.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    // Prevent updating to an email/phone that already exists for another patient
    const existing = await Patient.findOne({
      $or: [
        { email: req.body.email },
        { phone: req.body.phone }
      ],
      _id: { $ne: req.params.id }
    });

    if (existing) {
      if (existing.email === req.body.email && existing.phone === req.body.phone) {
        return res.status(400).json({ message: 'A patient with this email and phone number already exists.' });
      }
      if (existing.email === req.body.email) {
        return res.status(400).json({ message: 'A patient with this email already exists.' });
      }
      if (existing.phone === req.body.phone) {
        return res.status(400).json({ message: 'A patient with this phone number already exists.' });
      }
    }

    // Update all fields, including prescriptions, visits, medicalHistory, etc.
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          dob: req.body.dob,
          gender: req.body.gender,
          phone: req.body.phone,
          email: req.body.email,
          address: req.body.address,
          allergies: req.body.allergies,
          medications: req.body.medications,
          medicalHistory: req.body.medicalHistory || {},
          lastVisit: req.body.lastVisit || undefined
        },
        $push: {
      prescriptions: { $each: req.body.prescriptions || [] }, 
      visits: { $each: req.body.visits || [] } 
 
    }

      },
      { new: true, runValidators: true }
    );
    
    if (!updatedPatient) return res.status(404).json({ message: 'Patient not found' });
    res.json(updatedPatient);
  } catch (err) {
    if (err.code === 11000) {
      const fields = Object.keys(err.keyPattern);
      if (fields.includes('email') && fields.includes('phone')) {
        return res.status(400).json({ message: 'A patient with this email and phone number already exists.' });
      }
      if (fields.includes('email')) {
        return res.status(400).json({ message: 'A patient with this email already exists.' });
      }
      if (fields.includes('phone')) {
        return res.status(400).json({ message: 'A patient with this phone number already exists.' });
      }
      return res.status(400).json({ message: 'A patient with this information already exists.' });
    }
    res.status(400).json({ message: err.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: "Patient deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMedicalHistory = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    patient.medicalHistory.push(req.body);
    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add Visit
exports.addVisit = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    patient.visits.push(req.body);
    patient.lastVisit = req.body.date;
    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add Prescription
exports.addPrescription = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    patient.prescriptions.push(req.body);
    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Number of patients per condition
exports.patientsPerCondition = async (req, res) => {
  try {
    const data = await Patient.aggregate([
      { $unwind: "$medicalHistory" },
      { $group: { _id: "$medicalHistory.condition", count: { $sum: 1 } } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Most prescribed medications
exports.mostPrescribedMedications = async (req, res) => {
  try {
    const data = await Patient.aggregate([
      { $unwind: "$prescriptions" },
      { $group: { _id: "$prescriptions.medicationName", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Average patient age per department
exports.averageAgePerDepartment = async (req, res) => {
  try {
    const data = await Patient.aggregate([
      {
        $addFields: {
          age: {
            $floor: {
              $divide: [
                { $subtract: [new Date(), { $toDate: "$dob" }] },
                1000 * 60 * 60 * 24 * 365.25
              ]
            }
          }
        }
      },
      { $group: { _id: "$department", avgAge: { $avg: "$age" } } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Frequency of visits per month
exports.visitsPerMonth = async (req, res) => {
  try {
    const data = await Patient.aggregate([
      { $unwind: "$visits" },
      {
        $group: {
          _id: { $substr: ["$visits.date", 0, 7] }, // YYYY-MM
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.advancedSearch = async (req, res) => {
  const {
    search = '',
    condition = '',
    visitDate = '',
    sortField = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10,
  } = req.query;

  const query = {};

  // Search by patient ID (serial), name, or phone
  if (search) {
    const orArr = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
    // If search is a valid MongoDB ObjectId
    if (/^[a-f\d]{24}$/i.test(search)) {
      orArr.push({ _id: search });
    }
    query.$or = orArr;
  }

  // Search by condition
  if (condition) {
    query['medicalHistory.condition'] = { $regex: condition, $options: 'i' };
  }

  // Search by visit date
  if (visitDate) {
    query['visits.date'] = { $regex: visitDate, $options: 'i' };
  }
router.get("/api/patients", async (req, res) => {
  try {
    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ error: "Patient ID is required." });
    }

    const patient = await Patient.find({ patientId });

    if (!patient || patient.length === 0) {
      return res.status(404).json({ error: "Patient not found." });
    }

    res.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
  // Pagination and sorting
  const skip = (parseInt(page) - 1) * parseInt(pageSize);
  const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
  try {
    const total = await Patient.countDocuments(query);
    const patients = await Patient.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(pageSize));

    res.json({
      patients,
      totalPages: Math.max(1, Math.ceil(total / pageSize))
    });
  } catch (err) {
    console.error('Advanced Search Error:', err);
    res.status(500).json({ message: err.message });
  }
};