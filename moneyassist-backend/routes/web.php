<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'MoneyAssist API',
        'version' => '1.0.0',
        'status' => 'running',
    ]);
});

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});
