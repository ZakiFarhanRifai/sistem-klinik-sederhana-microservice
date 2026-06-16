import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const PORT = Number(process.env.PORT || 4000);
const PATIENT_SERVICE_URL = process.env.PATIENT_SERVICE_URL || "http://patient-service:3001";
const DOCTOR_SERVICE_URL = process.env.DOCTOR_SERVICE_URL || "http://doctor-service:3002";
const APPOINTMENT_SERVICE_URL = process.env.APPOINTMENT_SERVICE_URL || "http://appointment-service:3003";
const RECORD_SERVICE_URL = process.env.RECORD_SERVICE_URL || "http://medical-record-service:3004";

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request ke service gagal");
  return data;
}

const typeDefs = `#graphql
  type Patient {
    id: ID!
    name: String
    age: Int
    gender: String
    phone: String
  }

  type Doctor {
    id: ID!
    name: String
    specialization: String
    phone: String
  }

  type Appointment {
    id: ID!
    patientId: Int
    doctorId: Int
    date: String
    time: String
    status: String
    notes: String
  }

  type MedicalRecord {
    id: ID!
    patientId: Int
    doctorId: Int
    date: String
    diagnosis: String
    treatment: String
    prescription: String
    notes: String
  }

  type ServiceHealth {
    service: String
    language: String
    framework: String
    status: String
  }

  type SystemStatus {
    patient_service: ServiceHealth
    doctor_service: ServiceHealth
    appointment_service: ServiceHealth
    medical_record_service: ServiceHealth
  }

  type Query {
    # Patients
    patients: [Patient]
    patient(id: ID!): Patient

    # Doctors
    doctors: [Doctor]
    doctor(id: ID!): Doctor

    # Appointments
    appointments: [Appointment]
    appointment(id: ID!): Appointment

    # Medical Records
    records: [MedicalRecord]
    record(id: ID!): MedicalRecord

    # System
    systemStatus: SystemStatus
  }

  type Mutation {
    # Patients
    createPatient(name: String!, age: Int!, gender: String!, phone: String!): Patient
    updatePatient(id: ID!, name: String, age: Int, gender: String, phone: String): Patient
    deletePatient(id: ID!): Patient 

    # Doctors
    createDoctor(name: String!, specialization: String!, phone: String!): Doctor
    updateDoctor(id: ID!, name: String, specialization: String, phone: String): Doctor
    deleteDoctor(id: ID!): Doctor

    # Appointments
    createAppointment(patientId: Int!, doctorId: Int!, date: String!, time: String!, status: String, notes: String): Appointment
    updateAppointment(id: ID!, patientId: Int, doctorId: Int, date: String, time: String, status: String, notes: String): Appointment
    deleteAppointment(id: ID!): Appointment

    # Medical Records
    createRecord(patientId: Int!, doctorId: Int!, date: String!, diagnosis: String!, treatment: String!, prescription: String, notes: String): MedicalRecord
    updateRecord(id: ID!, patientId: Int, doctorId: Int, date: String, diagnosis: String, treatment: String, prescription: String, notes: String): MedicalRecord
    deleteRecord(id: ID!): MedicalRecord
  }
`;

const resolvers = {
  Query: {
    // Patients
    patients: async () => {
      const result = await fetchJson(`${PATIENT_SERVICE_URL}/patients`);
      return result.data;
    },
    patient: async (_, { id }) => {
      const result = await fetchJson(`${PATIENT_SERVICE_URL}/patients/${id}`);
      return result.data;
    },

    // Doctors
    doctors: async () => {
      const result = await fetchJson(`${DOCTOR_SERVICE_URL}/doctors`);
      return result.data;
    },
    doctor: async (_, { id }) => {
      const result = await fetchJson(`${DOCTOR_SERVICE_URL}/doctors/${id}`);
      return result.data;
    },

    // Appointments
    appointments: async () => {
      const result = await fetchJson(`${APPOINTMENT_SERVICE_URL}/appointments`);
      return result.data;
    },
    appointment: async (_, { id }) => {
      const result = await fetchJson(`${APPOINTMENT_SERVICE_URL}/appointments/${id}`);
      return result.data;
    },

    // Medical Records
    records: async () => {
      const result = await fetchJson(`${RECORD_SERVICE_URL}/records`);
      return result.data;
    },
    record: async (_, { id }) => {
      const result = await fetchJson(`${RECORD_SERVICE_URL}/records/${id}`);
      return result.data;
    },

    // System Status
    systemStatus: async () => {
      const [patientHealth, doctorHealth, appointmentHealth, recordHealth] = await Promise.all([
        fetchJson(`${PATIENT_SERVICE_URL}/health`),
        fetchJson(`${DOCTOR_SERVICE_URL}/health`),
        fetchJson(`${APPOINTMENT_SERVICE_URL}/health`),
        fetchJson(`${RECORD_SERVICE_URL}/health`)
      ]);
      return {
        patient_service: patientHealth,
        doctor_service: doctorHealth,
        appointment_service: appointmentHealth,
        medical_record_service: recordHealth
      };
    }
  },

  Mutation: {
    // Patients
    createPatient: async (_, args) => {
      const result = await fetchJson(`${PATIENT_SERVICE_URL}/patients`, {
        method: "POST",
        body: JSON.stringify(args)
      });
      return result.data;
    },
    updatePatient: async (_, { id, ...args }) => {
      const result = await fetchJson(`${PATIENT_SERVICE_URL}/patients/${id}`, {
        method: "PUT",
        body: JSON.stringify(args)
      });
      return result.data;
    },
    deletePatient: async (_, { id }) => {  // ← harusnya di sini
      const result = await fetchJson(`${PATIENT_SERVICE_URL}/patients/${id}`, {
        method: "DELETE"
      });
      return result.data;
    },

    // Doctors
    createDoctor: async (_, args) => {
      const result = await fetchJson(`${DOCTOR_SERVICE_URL}/doctors`, {
        method: "POST",
        body: JSON.stringify(args)
      });
      return result.data;
    },
    updateDoctor: async (_, { id, ...args }) => {
      const result = await fetchJson(`${DOCTOR_SERVICE_URL}/doctors/${id}`, {
        method: "PUT",
        body: JSON.stringify(args)
      });
      return result.data;
    },
    deleteDoctor: async (_, { id }) => {
      const result = await fetchJson(`${DOCTOR_SERVICE_URL}/doctors/${id}`, { method: "DELETE" });
      return result.data;
    },

    // Appointments
    createAppointment: async (_, args) => {
      const result = await fetchJson(`${APPOINTMENT_SERVICE_URL}/appointments`, {
        method: "POST",
        body: JSON.stringify(args)
      });
      return result.data;
    },
    updateAppointment: async (_, { id, ...args }) => {
      const result = await fetchJson(`${APPOINTMENT_SERVICE_URL}/appointments/${id}`, {
        method: "PUT",
        body: JSON.stringify(args)
      });
      return result.data;
    },
    deleteAppointment: async (_, { id }) => {
      const result = await fetchJson(`${APPOINTMENT_SERVICE_URL}/appointments/${id}`, { method: "DELETE" });
      return result.data;
    },

    // Medical Records
    createRecord: async (_, args) => {
      const result = await fetchJson(`${RECORD_SERVICE_URL}/records`, {
        method: "POST",
        body: JSON.stringify(args)
      });
      return result.data;
    },
    updateRecord: async (_, { id, ...args }) => {
      const result = await fetchJson(`${RECORD_SERVICE_URL}/records/${id}`, {
        method: "PUT",
        body: JSON.stringify(args)
      });
      return result.data;
    },
    deleteRecord: async (_, { id }) => {
      const result = await fetchJson(`${RECORD_SERVICE_URL}/records/${id}`, { method: "DELETE" });
      return result.data;
    },
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { host: "0.0.0.0", port: PORT }
});

console.log(`GraphQL Gateway berjalan pada ${url}`);