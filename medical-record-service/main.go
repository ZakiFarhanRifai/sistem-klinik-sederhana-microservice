package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
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

var records = []MedicalRecord{
	{ID: 1, PatientID: 1, DoctorID: 1, Date: "2025-06-10", Diagnosis: "Hipertensi ringan", Treatment: "Istirahat cukup, diet rendah garam", Prescription: "Amlodipine 5mg", Notes: "Kontrol 2 minggu lagi"},
	{ID: 2, PatientID: 2, DoctorID: 2, Date: "2025-06-11", Diagnosis: "ISPA", Treatment: "Istirahat, minum air putih", Prescription: "Amoxicillin 250mg", Notes: "Hindari minuman dingin"},
	{ID: 3, PatientID: 3, DoctorID: 3, Date: "2025-06-12", Diagnosis: "Aritmia ringan", Treatment: "EKG rutin, olahraga ringan", Prescription: "Bisoprolol 2.5mg", Notes: "Hindari kafein"},
}

func main() {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"service":   "medical-record-service",
			"language":  "Go",
			"framework": "Gin",
			"status":    "running",
		})
	})

	r.GET("/records", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"service": "medical-record-service",
			"data":    records,
		})
	})

	r.GET("/records/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		for _, record := range records {
			if record.ID == id {
				c.JSON(http.StatusOK, gin.H{
					"service": "medical-record-service",
					"data":    record,
				})
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"message": "Rekam medis tidak ditemukan"})
	})

	r.POST("/records", func(c *gin.Context) {
		var body MedicalRecord
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Request tidak valid"})
			return
		}
		body.ID = len(records) + 1
		records = append(records, body)
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
		for i, record := range records {
			if record.ID == id {
				if body.PatientID != 0 { records[i].PatientID = body.PatientID }
				if body.DoctorID != 0 { records[i].DoctorID = body.DoctorID }
				if body.Date != "" { records[i].Date = body.Date }
				if body.Diagnosis != "" { records[i].Diagnosis = body.Diagnosis }
				if body.Treatment != "" { records[i].Treatment = body.Treatment }
				if body.Prescription != "" { records[i].Prescription = body.Prescription }
				if body.Notes != "" { records[i].Notes = body.Notes }
				c.JSON(http.StatusOK, gin.H{
					"service": "medical-record-service",
					"message": "Rekam medis berhasil diupdate",
					"data":    records[i],
				})
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"message": "Rekam medis tidak ditemukan"})
	})

	r.Run("0.0.0.0:3004")
}