const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Schema untuk auto-increment id numerik
const counterSchema = new mongoose.Schema({
  _id: String,
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', counterSchema);

async function getNextSequence(name) {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

const appointmentSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
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
}, {
  timestamps: true
});

// Sembunyikan _id dan __v dari response JSON
appointmentSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    service: 'appointment-service',
    language: 'JavaScript',
    framework: 'Express',
    database: 'MongoDB',
    status: 'running'
  });
});

// ─── GET semua appointment ────────────────────────────────────
app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().select('-_id -__v');
    res.json({
      service: 'appointment-service',
      data: appointments
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── GET appointment by id ────────────────────────────────────
app.get('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ id: Number(req.params.id) }).select('-_id -__v');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment tidak ditemukan' });
    }

    res.json({
      service: 'appointment-service',
      data: appointment
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── POST buat appointment baru ───────────────────────────────
app.post('/appointments', async (req, res) => {
  try {
    const nextId = await getNextSequence('appointmentId');

    const appointment = await Appointment.create({
      id: nextId,
      patientId: req.body.patientId,
      doctorId: req.body.doctorId,
      date: req.body.date,
      time: req.body.time,
      status: req.body.status || 'scheduled',
      notes: req.body.notes || ''
    });

    res.status(201).json({
      service: 'appointment-service',
      message: 'Appointment berhasil ditambahkan',
      data: appointment.toJSON()
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── PUT update appointment ───────────────────────────────────
app.put('/appointments/:id', async (req, res) => {
  try {
    // Cegah update field id dan _id
    const { id: _ignore, _id: _ignore2, ...updateData } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { id: Number(req.params.id) },
      updateData,
      { new: true }
    ).select('-_id -__v');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment tidak ditemukan' });
    }

    res.json({
      service: 'appointment-service',
      message: 'Appointment berhasil diupdate',
      data: appointment
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── DELETE appointment ───────────────────────────────────────
app.delete('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({ id: Number(req.params.id) });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment tidak ditemukan' });
    }

    res.json({
      service: 'appointment-service',
      message: 'Appointment berhasil dihapus'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.listen(3003, '0.0.0.0', () => {
  console.log('appointment-service running on port 3003');
});