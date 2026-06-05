from flask import Flask, jsonify, request

app = Flask(__name__)

doctors = [
    {"id": 1, "name": "Dr. Andi Wijaya", "specialization": "Umum", "phone": "081111111111"},
    {"id": 2, "name": "Dr. Sari Dewi", "specialization": "Anak", "phone": "082222222222"},
    {"id": 3, "name": "Dr. Budi Hartono", "specialization": "Jantung", "phone": "083333333333"},
]

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "service": "doctor-service",
        "language": "Python",
        "framework": "Flask",
        "status": "running"
    })

@app.route("/doctors", methods=["GET"])
def get_doctors():
    return jsonify({
        "service": "doctor-service",
        "data": doctors
    })

@app.route("/doctors/<int:id>", methods=["GET"])
def get_doctor(id):
    doctor = next((d for d in doctors if d["id"] == id), None)
    if not doctor:
        return jsonify({"message": "Dokter tidak ditemukan"}), 404
    return jsonify({
        "service": "doctor-service",
        "data": doctor
    })

@app.route("/doctors", methods=["POST"])
def create_doctor():
    body = request.get_json()
    doctor = {
        "id": len(doctors) + 1,
        "name": body.get("name"),
        "specialization": body.get("specialization"),
        "phone": body.get("phone"),
    }
    doctors.append(doctor)
    return jsonify({
        "service": "doctor-service",
        "message": "Dokter berhasil ditambahkan",
        "data": doctor
    }), 201

@app.route("/doctors/<int:id>", methods=["PUT"])
def update_doctor(id):
    body = request.get_json()
    for doctor in doctors:
        if doctor["id"] == id:
            doctor["name"] = body.get("name", doctor["name"])
            doctor["specialization"] = body.get("specialization", doctor["specialization"])
            doctor["phone"] = body.get("phone", doctor["phone"])
            return jsonify({
                "service": "doctor-service",
                "message": "Data dokter berhasil diupdate",
                "data": doctor
            })
    return jsonify({"message": "Dokter tidak ditemukan"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3002)