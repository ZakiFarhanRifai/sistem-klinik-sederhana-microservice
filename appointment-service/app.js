const express = require('express');
const app = express();
app.use(express.json());

let appointments = [
  { id: 1, patientId: 1, doctorId: 1, date: '2025-06-10', time: '09:00', status: 'scheduled', notes: 'Konsultasi rutin' },
  { id: 2, patientId: 2, doctorId: 2, date: '2025-06-11', time: '10:30', status: 'scheduled', notes: 'Kontrol anak' },
  { id: 3, patientId: 3, doctorId: 3, date: '2025-06-12', time: '14:00', status: 'completed', notes: 'Cek jantung' },
];

app.get('/health', (req, res) => {
  res.json({
    service: 'appointment-service',
    language: 'JavaScript',
    framework: 'Express',
    status: 'running'
  });
});

app.get('/appointments', (req, res) => {
  res.json({ service: 'appointment-service', data: appointments });
});

app.get('/appointments/:id', (req, res) => {
  const appointment = appointments.find(a => a.id === parseInt(req.params.id));
  if (!appointment) return res.status(404).json({ message: 'Appointment tidak ditemukan' });
  res.json({ service: 'appointment-service', data: appointment });
});

app.post('/appointments', (req, res) => {
  const appointment = {
    id: appointments.length + 1,
    patientId: req.body.patientId,
    doctorId: req.body.doctorId,
    date: req.body.date,
    time: req.body.time,
    status: req.body.status ?? 'scheduled',
    notes: req.body.notes ?? '',
  };
  appointments.push(appointment);
  res.status(201).json({
    service: 'appointment-service',
    message: 'Appointment berhasil ditambahkan',
    data: appointment
  });
});

app.put('/appointments/:id', (req, res) => {
  const appointment = appointments.find(a => a.id === parseInt(req.params.id));
  if (!appointment) return res.status(404).json({ message: 'Appointment tidak ditemukan' });

  appointment.patientId   = req.body.patientId   ?? appointment.patientId;
  appointment.doctorId    = req.body.doctorId     ?? appointment.doctorId;
  appointment.date        = req.body.date         ?? appointment.date;
  appointment.time        = req.body.time         ?? appointment.time;
  appointment.status      = req.body.status       ?? appointment.status;
  appointment.notes       = req.body.notes        ?? appointment.notes;

  res.json({
    service: 'appointment-service',
    message: 'Appointment berhasil diupdate',
    data: appointment
  });
});

app.listen(3003, '0.0.0.0', () => {
  console.log('appointment-service running on port 3003');
});