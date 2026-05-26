<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

    // Transaction routes
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show']);
    Route::put('/transactions/{transaction}', [TransactionController::class, 'update']);
    Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy']);
    Route::get('/transactions/statistics', [TransactionController::class, 'statistics']);

    // Goal routes
    Route::get('/goals', [GoalController::class, 'index']);
    Route::post('/goals', [GoalController::class, 'store']);
    Route::get('/goals/{goal}', [GoalController::class, 'show']);
    Route::put('/goals/{goal}', [GoalController::class, 'update']);
    Route::delete('/goals/{goal}', [GoalController::class, 'destroy']);
    Route::post('/goals/{goal}/progress', [GoalController::class, 'addProgress']);
    Route::get('/goals/statistics', [GoalController::class, 'statistics']);

    // Chat routes
    Route::get('/chat/history', [ChatController::class, 'history']);
    Route::post('/chat/send', [ChatController::class, 'sendMessage']);
    Route::get('/chat/{message}', [ChatController::class, 'show']);
    Route::delete('/chat/{message}', [ChatController::class, 'destroy']);
    Route::delete('/chat', [ChatController::class, 'clearHistory']);

    // Recommendation routes
    Route::get('/recommendations', [RecommendationController::class, 'index']);
    Route::post('/recommendations/generate', [RecommendationController::class, 'generate']);
    Route::get('/recommendations/{recommendation}', [RecommendationController::class, 'show']);
    Route::put('/recommendations/{recommendation}/status', [RecommendationController::class, 'updateStatus']);
    Route::delete('/recommendations/{recommendation}', [RecommendationController::class, 'destroy']);
    Route::get('/recommendations/statistics', [RecommendationController::class, 'statistics']);
});

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});
