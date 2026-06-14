<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Patient;

Route::get('/health', function () {
    return response()->json([
        'service' => 'patient-service',
        'language' => 'PHP',
        'framework' => 'Laravel',
        'status' => 'running'
    ]);
});

Route::get('/patients', function () {
    return response()->json([
        'service' => 'patient-service',
        'data' => Patient::all()
    ]);
});

Route::get('/patients/{id}', function ($id) {
    $patient = Patient::find($id);

    if (!$patient) {
        return response()->json(['message' => 'Pasien tidak ditemukan'], 404);
    }

    return response()->json([
        'service' => 'patient-service',
        'data' => $patient
    ]);
});

Route::post('/patients', function (Request $request) {
    $patient = Patient::create([
        'name'   => $request->name,
        'age'    => $request->age,
        'gender' => $request->gender,
        'phone'  => $request->phone,
    ]);

    return response()->json([
        'service' => 'patient-service',
        'message' => 'Pasien berhasil ditambahkan',
        'data' => $patient
    ], 201);
});

Route::put('/patients/{id}', function (Request $request, $id) {
    $patient = Patient::find($id);

    if (!$patient) {
        return response()->json(['message' => 'Pasien tidak ditemukan'], 404);
    }

    $patient->update([
        'name'   => $request->name ?? $patient->name,
        'age'    => $request->age ?? $patient->age,
        'gender' => $request->gender ?? $patient->gender,
        'phone'  => $request->phone ?? $patient->phone,
    ]);

    return response()->json([
        'service' => 'patient-service',
        'message' => 'Data pasien berhasil diupdate',
        'data' => $patient
    ]);
});

Route::delete('/patients/{id}', function ($id) {
    $patient = Patient::find($id);

    if (!$patient) {
        return response()->json(['message' => 'Pasien tidak ditemukan'], 404);
    }

    $patient->delete();

    return response()->json([
        'service' => 'patient-service',
        'message' => 'Pasien berhasil dihapus'
    ]);
});
