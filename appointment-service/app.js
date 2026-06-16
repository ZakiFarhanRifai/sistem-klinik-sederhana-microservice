const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

const appointmentSchema = new mongoose.Schema({
patientId: Number,
doctorId: Number,
date: String,
time: String,
status: {
type: String,
default: 'scheduled'
},
notes: {
type: String,
default: ''
}
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

app.get('/health', (req, res) => {
res.json({
service: 'appointment-service',
language: 'JavaScript',
framework: 'Express',
database: 'MongoDB',
status: 'running'
});
});

app.get('/appointments', async (req, res) => {
const appointments = await Appointment.find();
res.json({
service: 'appointment-service',
data: appointments
});
});

app.get('/appointments/:id', async (req, res) => {
const appointment = await Appointment.findById(req.params.id);

if (!appointment) {
return res.status(404).json({
message: 'Appointment tidak ditemukan'
});
}

res.json({
service: 'appointment-service',
data: appointment
});
});

app.post('/appointments', async (req, res) => {
const appointment = await Appointment.create({
patientId: req.body.patientId,
doctorId: req.body.doctorId,
date: req.body.date,
time: req.body.time,
status: req.body.status,
notes: req.body.notes
});

res.status(201).json({
service: 'appointment-service',
message: 'Appointment berhasil ditambahkan',
data: appointment
});
});

app.put('/appointments/:id', async (req, res) => {
const appointment = await Appointment.findByIdAndUpdate(
req.params.id,
req.body,
{ new: true }
);

if (!appointment) {
return res.status(404).json({
message: 'Appointment tidak ditemukan'
});
}

res.json({
service: 'appointment-service',
message: 'Appointment berhasil diupdate',
data: appointment
});
});

app.delete('/appointments/:id', async (req, res) => {
const appointment = await Appointment.findByIdAndDelete(req.params.id);

if (!appointment) {
return res.status(404).json({
message: 'Appointment tidak ditemukan'
});
}

res.json({
service: 'appointment-service',
message: 'Appointment berhasil dihapus'
});
});

app.listen(3003, '0.0.0.0', () => {
console.log('appointment-service running on port 3003');
});
