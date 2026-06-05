const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

const PATIENT_SERVICE_URL = process.env.PATIENT_SERVICE_URL || "http://patient-service:3001";
const DOCTOR_SERVICE_URL = process.env.DOCTOR_SERVICE_URL || "http://doctor-service:3002";
const APPOINTMENT_SERVICE_URL = process.env.APPOINTMENT_SERVICE_URL || "http://appointment-service:3003";
const RECORD_SERVICE_URL = process.env.RECORD_SERVICE_URL || "http://medical-record-service:3004";

app.get("/", (req, res) => {
  res.json({
    service: "api-gateway",
    message: "Hospital Microservice API Gateway",
    endpoints: [
      "/patients", "/doctors", "/appointments", "/records", "/health"
    ],
    services: [
      "PHP Laravel - Patient Service",
      "Python Flask - Doctor Service",
      "Node.js Express - Appointment Service",
      "Go Gin - Medical Record Service"
    ]
  });
});

app.get("/health", (req, res) => {
  res.json({ service: "api-gateway", status: "running" });
});

// ── Patient Service ──────────────────────────────────────
app.get("/patients", async (req, res) => {
  try {
    const response = await fetch(`${PATIENT_SERVICE_URL}/patients`);
    const data = await response.json();
    res.json({ gateway: "api-gateway", source: "patient-service", result: data });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghubungi Patient Service", error: error.message });
  }
});

app.get("/patients/:id", async (req, res) => {
  try {
    const response = await fetch(`${PATIENT_SERVICE_URL}/patients/${req.params.id}`);
    const data = await response.json();
    res.status(response.status).json({ gateway: "api-gateway", source: "patient-service", result: data });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghubungi Patient Service", error: error.message });
  }
});

app.post("/patients", async (req, res) => {
  try {
    const response = await fetch(`${PATIENT_SERVICE_URL}/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json({ gateway: "api-gateway", source: "patient-service", result: data });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghubungi Patient Service", error: error.message });
  }
});

app.put("/patients/:id", async (req, res) => {
  try {
    const response = await fetch(`${PATIENT_SERVICE_URL}/patients/${req.params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json({ gateway: "api-gateway", source: "patient-service", result: data });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghubungi Patient Service", error: error.message });
  }
});

// ── Doctor Service ───────────────────────────────────────
app.get("/doctors", async (req, res) => {
  try {
    const response = await fetch(`${DOCTOR_SERVICE_URL}/doctors`);
    const data = await response.json();
    res.json({ gateway: "api-gateway", source: "doctor-service", result: data });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghubungi Doctor Service", error: error.message });
  }
});

app.get("/doctors/:id", async (req, res) => {
  try {
    const response = await fetch(`${DOCTOR_SERVICE_URL}/doctors/${req.params.id}`);
    const data = await response.json();
    res.status(response.status).json({ gateway: "api-gateway", source: "doctor-service", result: data });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghubungi Doctor Service", error: error.message });
  }
});

app.post("/doctors", async (req, res) => {
  try {
    const response = await fetch(`${DOCTOR_SERVICE_URL}/doctors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json({ gateway: "api-gateway", source: "doctor-service", result: data });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghubungi Doctor Service", error: error.message });
  }
});

app.put("/doctors/:id", async (req, res) => {
  try {
    const response = await fetch(`${DOCTOR_SERVICE_URL}/doctors/${req.params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json({ gateway: "api-gateway", source: "doctor-service", result: data });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghubungi Doctor Service", error: error.message });
  }
});

// ── Appointment Service ──────────────────────────────────
app.get("/appointments", async (req, res) => {
  try {
    const response = await fetch(`${APPOINTMENT_SERVICE_URL}/appointments`);
    const data = await response.json();
    res.json({ gateway: "api-gateway", source: "appointment-service", result: data });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghubungi Appointment Service", error: error.message });
  }
});

app.get("/appointments/:id", async (req, res) => {
  try {
    const response = await fetch(`${APPOINTMENT_SERVICE_URL}/appointments/${req.params.id}`);
    const data = await response.json();
    res.status(response.status).json({ gateway: "api-gateway", source: "appointment-service", result: data });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghubungi Appointment Service", error: error.message });
  }
});

app.post("/appointments", async (req, res) => {
  try {
    const response = await fetch(`${APPOINTMENT_SERVICE_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json({ gateway: "api-gateway", source: "appointment-service", result: data });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghubungi Appointment Service", error: error.message });
  }
});

app.put("/appointments/:id", async (req, res) => {
  try {
    const response = await fetch(`${APPOINTMENT_SERVICE_URL}/appointments/${req.params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json({ gateway: "api-gateway", source: "appointment-service", result: data });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghubungi Appointment Service", error: error.message });
  }
});

// ── Medical Record Service ───────────────────────────────
app.get("/records", async (req, res) => {
  try {
    const response = await fetch(`${RECORD_SERVICE_URL}/records`);
    const data = await response.json();
    res.json({ gateway: "api-gateway", source: "medical-record-service", result: data });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghubungi Medical Record Service", error: error.message });
  }
});

app.get("/records/:id", async (req, res) => {
  try {
    const response = await fetch(`${RECORD_SERVICE_URL}/records/${req.params.id}`);
    const data = await response.json();
    res.status(response.status).json({ gateway: "api-gateway", source: "medical-record-service", result: data });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghubungi Medical Record Service", error: error.message });
  }
});

app.post("/records", async (req, res) => {
  try {
    const response = await fetch(`${RECORD_SERVICE_URL}/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json({ gateway: "api-gateway", source: "medical-record-service", result: data });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghubungi Medical Record Service", error: error.message });
  }
});

app.put("/records/:id", async (req, res) => {
  try {
    const response = await fetch(`${RECORD_SERVICE_URL}/records/${req.params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json({ gateway: "api-gateway", source: "medical-record-service", result: data });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghubungi Medical Record Service", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway berjalan pada port ${PORT}`);
});