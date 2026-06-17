package main

import (
    "database/sql"
    "fmt"
    "log"
    "net/http"
    "os"
    "strconv"

    "github.com/gin-gonic/gin"
    _ "github.com/lib/pq"
)

type MedicalRecord struct {
	ID           int    `json:"id"`
	PatientID    int    `json:"patientId"`
	DoctorID     int    `json:"doctorId"`
	Date         string `json:"date"`
	Diagnosis    string `json:"diagnosis"`
	Treatment    string `json:"treatment"`
	Prescription string `json:"prescription"`
	Notes        string `json:"notes"`
}

var db *sql.DB

func initDB() {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	var err error
	db, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Gagal konek DB:", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal("DB tidak bisa di-ping:", err)
	}

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS medical_records (
			id           SERIAL PRIMARY KEY,
			patient_id   INT NOT NULL,
			doctor_id    INT NOT NULL,
			date         VARCHAR(50) NOT NULL,
			diagnosis    TEXT NOT NULL,
			treatment    TEXT NOT NULL,
			prescription TEXT,
			notes        TEXT
		)
	`)
	if err != nil {
		log.Fatal("Gagal buat tabel:", err)
	}

	log.Println("Database siap")
}

func main() {
	initDB()

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"service":   "medical-record-service",
			"language":  "Go",
			"framework": "Gin",
			"database":  "PostgreSQL",
			"status":    "running",
		})
	})

	
	r.GET("/records", func(c *gin.Context) {
		rows, err := db.Query(`
			SELECT id, patient_id, doctor_id, date, diagnosis, treatment, prescription, notes
			FROM medical_records
		`)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal mengambil data"})
			return
		}
		defer rows.Close()

		var records []MedicalRecord
		for rows.Next() {
			var r MedicalRecord
			rows.Scan(&r.ID, &r.PatientID, &r.DoctorID, &r.Date, &r.Diagnosis, &r.Treatment, &r.Prescription, &r.Notes)
			records = append(records, r)
		}
		if records == nil {
			records = []MedicalRecord{}
		}

		c.JSON(http.StatusOK, gin.H{"service": "medical-record-service", "data": records})
	})


	r.GET("/records/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		var rec MedicalRecord
		err := db.QueryRow(`
			SELECT id, patient_id, doctor_id, date, diagnosis, treatment, prescription, notes
			FROM medical_records WHERE id = $1
		`, id).Scan(&rec.ID, &rec.PatientID, &rec.DoctorID, &rec.Date, &rec.Diagnosis, &rec.Treatment, &rec.Prescription, &rec.Notes)
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"message": "Rekam medis tidak ditemukan"})
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal mengambil data"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"service": "medical-record-service", "data": rec})
	})


	r.POST("/records", func(c *gin.Context) {
		var body MedicalRecord
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Request tidak valid"})
			return
		}
		err := db.QueryRow(`
			INSERT INTO medical_records (patient_id, doctor_id, date, diagnosis, treatment, prescription, notes)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING id
		`, body.PatientID, body.DoctorID, body.Date, body.Diagnosis, body.Treatment, body.Prescription, body.Notes).Scan(&body.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal menyimpan data"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{
			"service": "medical-record-service",
			"message": "Rekam medis berhasil ditambahkan",
			"data":    body,
		})
	})


	r.PUT("/records/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		var body MedicalRecord
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Request tidak valid"})
			return
		}

		var rec MedicalRecord
		err := db.QueryRow(`
			SELECT id, patient_id, doctor_id, date, diagnosis, treatment, prescription, notes
			FROM medical_records WHERE id = $1
		`, id).Scan(&rec.ID, &rec.PatientID, &rec.DoctorID, &rec.Date, &rec.Diagnosis, &rec.Treatment, &rec.Prescription, &rec.Notes)
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"message": "Rekam medis tidak ditemukan"})
			return
		}

		// Merge field yang diisi saja
		if body.PatientID != 0 { rec.PatientID = body.PatientID }
		if body.DoctorID != 0 { rec.DoctorID = body.DoctorID }
		if body.Date != "" { rec.Date = body.Date }
		if body.Diagnosis != "" { rec.Diagnosis = body.Diagnosis }
		if body.Treatment != "" { rec.Treatment = body.Treatment }
		if body.Prescription != "" { rec.Prescription = body.Prescription }
		if body.Notes != "" { rec.Notes = body.Notes }

		_, err = db.Exec(`
			UPDATE medical_records
			SET patient_id=$1, doctor_id=$2, date=$3, diagnosis=$4, treatment=$5, prescription=$6, notes=$7
			WHERE id=$8
		`, rec.PatientID, rec.DoctorID, rec.Date, rec.Diagnosis, rec.Treatment, rec.Prescription, rec.Notes, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal update data"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"service": "medical-record-service",
			"message": "Rekam medis berhasil diupdate",
			"data":    rec,
		})
	})

	r.DELETE("/records/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		result, err := db.Exec("DELETE FROM medical_records WHERE id = $1", id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal menghapus data"})
			return
		}
		rowsAffected, _ := result.RowsAffected()
		if rowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"message": "Rekam medis tidak ditemukan"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"service": "medical-record-service",
			"message": "Rekam medis berhasil dihapus",
		})
	})

	r.Run("0.0.0.0:3004")
}