<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

$patients = [
    ['id' => 1, 'name' => 'Budi Santoso', 'age' => 30, 'gender' => 'Laki-laki', 'phone' => '081234567890'],
    ['id' => 2, 'name' => 'Siti Rahayu', 'age' => 25, 'gender' => 'Perempuan', 'phone' => '082345678901'],
    ['id' => 3, 'name' => 'Ahmad Fauzi', 'age' => 45, 'gender' => 'Laki-laki', 'phone' => '083456789012'],
];

Route::get('/health', function () {
    return response()->json([
        'service' => 'patient-service',
        'language' => 'PHP',
        'framework' => 'Laravel',
        'status' => 'running'
    ]);
});

Route::get('/patients', function () use ($patients) {
    return response()->json([
        'service' => 'patient-service',
        'data' => $patients
    ]);
});

Route::get('/patients/{id}', function ($id) use ($patients) {
    $patient = collect($patients)->firstWhere('id', (int)$id);
    if (!$patient) {
        return response()->json(['message' => 'Pasien tidak ditemukan'], 404);
    }
    return response()->json([
        'service' => 'patient-service',
        'data' => $patient
    ]);
});

Route::post('/patients', function (Request $request) use (&$patients) {
    $patient = [
        'id' => count($patients) + 1,
        'name' => $request->name,
        'age' => $request->age,
        'gender' => $request->gender,
        'phone' => $request->phone,
    ];
    $patients[] = $patient;
    return response()->json([
        'service' => 'patient-service',
        'message' => 'Pasien berhasil ditambahkan',
        'data' => $patient
    ], 201);
});

Route::put('/patients/{id}', function (Request $request, $id) use (&$patients) {
    foreach ($patients as &$patient) {
        if ($patient['id'] === (int)$id) {
            $patient['name'] = $request->name ?? $patient['name'];
            $patient['age'] = $request->age ?? $patient['age'];
            $patient['gender'] = $request->gender ?? $patient['gender'];
            $patient['phone'] = $request->phone ?? $patient['phone'];
            return response()->json([
                'service' => 'patient-service',
                'message' => 'Data pasien berhasil diupdate',
                'data' => $patient
            ]);
        }
    }
    return response()->json(['message' => 'Pasien tidak ditemukan'], 404);
});