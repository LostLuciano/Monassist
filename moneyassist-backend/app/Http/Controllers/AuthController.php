<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'currency' => 'USD',
                'language' => 'en',
                'theme' => 'light',
                'notifications_enabled' => true,
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->successResponse([
                'user' => $user,
                'token' => $token,
            ], 'User registered successfully', 201);
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        }
    }

    /**
     * Login user.
     */
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            $user = User::where('email', $validated['email'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                return $this->errorResponse('Invalid credentials', 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->successResponse([
                'user' => $user,
                'token' => $token,
            ], 'Login successful');
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        }
    }

    /**
     * Logout user.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'Logout successful');
    }

    /**
     * Get current user.
     */
    public function me(Request $request)
    {
        return $this->successResponse($request->user(), 'User retrieved successfully');
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'phone' => 'sometimes|string|max:20',
                'avatar_url' => 'sometimes|url',
                'bio' => 'sometimes|string|max:500',
                'currency' => 'sometimes|string|max:3',
                'language' => 'sometimes|string|max:5',
                'theme' => 'sometimes|in:light,dark',
            ]);

            $request->user()->update($validated);

            return $this->successResponse($request->user(), 'Profile updated successfully');
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        }
    }

    /**
     * Change password.
     */
    public function changePassword(Request $request)
    {
        try {
            $validated = $request->validate([
                'current_password' => 'required|string',
                'password' => 'required|string|min:8|confirmed',
            ]);

            if (!Hash::check($validated['current_password'], $request->user()->password)) {
                return $this->errorResponse('Current password is incorrect', 401);
            }

            $request->user()->update([
                'password' => Hash::make($validated['password']),
            ]);

            return $this->successResponse(null, 'Password changed successfully');
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        }
    }
}
