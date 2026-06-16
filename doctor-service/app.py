from flask import Flask, jsonify, request
import mysql.connector
import os

app = Flask(__name__)

# ==========================
# DATABASE CONNECTION
# ==========================
def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "doctor-db"),
        user=os.getenv("DB_USER", "doctor_user"),
        password=os.getenv("DB_PASSWORD", "doctor_password"),
        database=os.getenv("DB_NAME", "doctor_db")
    )

# ==========================
# INITIALIZE TABLE
# ==========================
def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS doctors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            specialization VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL
        )
    """)

    cursor.execute("SELECT COUNT(*) FROM doctors")
    count = cursor.fetchone()[0]

    if count == 0:
        cursor.executemany("""
            INSERT INTO doctors (name, specialization, phone)
            VALUES (%s, %s, %s)
        """, [
            ("Dr. Andi Wijaya", "Umum", "081111111111"),
            ("Dr. Sari Dewi", "Anak", "082222222222"),
            ("Dr. Budi Hartono", "Jantung", "083333333333")
        ])

    conn.commit()
    cursor.close()
    conn.close()

# ==========================
# HEALTH CHECK
# ==========================
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "service": "doctor-service",
        "language": "Python",
        "framework": "Flask",
        "database": "MySQL",
        "status": "running"
    })

# ==========================
# GET ALL DOCTORS
# ==========================
@app.route("/doctors", methods=["GET"])
def get_doctors():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM doctors")
    doctors = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        "service": "doctor-service",
        "data": doctors
    })

# ==========================
# GET DOCTOR BY ID
# ==========================
@app.route("/doctors/<int:id>", methods=["GET"])
def get_doctor(id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM doctors WHERE id = %s", (id,))
    doctor = cursor.fetchone()

    cursor.close()
    conn.close()

    if not doctor:
        return jsonify({
            "message": "Dokter tidak ditemukan"
        }), 404

    return jsonify({
        "service": "doctor-service",
        "data": doctor
    })

# ==========================
# CREATE DOCTOR
# ==========================
@app.route("/doctors", methods=["POST"])
def create_doctor():
    body = request.get_json()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO doctors (name, specialization, phone)
        VALUES (%s, %s, %s)
    """, (
        body.get("name"),
        body.get("specialization"),
        body.get("phone")
    ))

    conn.commit()

    doctor_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return jsonify({
        "service": "doctor-service",
        "message": "Dokter berhasil ditambahkan",
        "data": {
            "id": doctor_id,
            "name": body.get("name"),
            "specialization": body.get("specialization"),
            "phone": body.get("phone")
        }
    }), 201

# ==========================
# UPDATE DOCTOR
# ==========================
@app.route("/doctors/<int:id>", methods=["PUT"])
def update_doctor(id):
    body = request.get_json()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE doctors
        SET name=%s,
            specialization=%s,
            phone=%s
        WHERE id=%s
    """, (
        body.get("name"),
        body.get("specialization"),
        body.get("phone"),
        id
    ))

    conn.commit()

    if cursor.rowcount == 0:
        cursor.close()
        conn.close()
        return jsonify({
            "message": "Dokter tidak ditemukan"
        }), 404

    cursor.close()
    conn.close()

    return jsonify({
        "service": "doctor-service",
        "message": "Data dokter berhasil diupdate"
    })

# ==========================
# DELETE DOCTOR
# ==========================
@app.route("/doctors/<int:id>", methods=["DELETE"])
def delete_doctor(id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM doctors WHERE id=%s",
        (id,)
    )

    conn.commit()

    if cursor.rowcount == 0:
        cursor.close()
        conn.close()
        return jsonify({
            "message": "Dokter tidak ditemukan"
        }), 404

    cursor.close()
    conn.close()

    return jsonify({
        "service": "doctor-service",
        "message": "Dokter berhasil dihapus"
    })

# ==========================
# START APP
# ==========================
if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=3002)