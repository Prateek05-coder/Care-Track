const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patients', patientRoutes);

module.exports = app;