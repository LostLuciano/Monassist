<?php

namespace App\Http\Controllers;

use App\Models\SavingsGoal;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class GoalController extends Controller
{
    use ApiResponse;

    /**
     * Get all goals for the user.
     */
    public function index(Request $request)
    {
        $goals = $request->user()->savingsGoals()
            ->orderBy('deadline', 'asc')
            ->paginate(20);

        return $this->paginatedResponse($goals, 'Goals retrieved successfully');
    }

    /**
     * Create a new goal.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'sometimes|string|max:1000',
                'target_amount' => 'required|numeric|min:0.01',
                'deadline' => 'required|date|after:today',
                'category' => 'sometimes|string|max:50',
                'icon' => 'sometimes|string|max:50',
                'color' => 'sometimes|string|max:7',
                'priority' => 'sometimes|in:low,medium,high',
            ]);

            $goal = $request->user()->savingsGoals()->create([
                ...$validated,
                'current_amount' => 0,
                'status' => 'active',
            ]);

            return $this->successResponse($goal, 'Goal created successfully', 201);
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        }
    }

    /**
     * Get a specific goal.
     */
    public function show(Request $request, SavingsGoal $goal)
    {
        if ($goal->user_id !== $request->user()->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        return $this->successResponse($goal, 'Goal retrieved successfully');
    }

    /**
     * Update a goal.
     */
    public function update(Request $request, SavingsGoal $goal)
    {
        if ($goal->user_id !== $request->user()->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|string|max:1000',
                'target_amount' => 'sometimes|numeric|min:0.01',
                'current_amount' => 'sometimes|numeric|min:0',
                'deadline' => 'sometimes|date|after:today',
                'category' => 'sometimes|string|max:50',
                'icon' => 'sometimes|string|max:50',
                'color' => 'sometimes|string|max:7',
                'priority' => 'sometimes|in:low,medium,high',
                'status' => 'sometimes|in:active,completed,abandoned',
            ]);

            $goal->update($validated);

            return $this->successResponse($goal, 'Goal updated successfully');
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        }
    }

    /**
     * Delete a goal.
     */
    public function destroy(Request $request, SavingsGoal $goal)
    {
        if ($goal->user_id !== $request->user()->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $goal->delete();

        return $this->successResponse(null, 'Goal deleted successfully');
    }

    /**
     * Add progress to a goal.
     */
    public function addProgress(Request $request, SavingsGoal $goal)
    {
        if ($goal->user_id !== $request->user()->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        try {
            $validated = $request->validate([
                'amount' => 'required|numeric|min:0.01',
            ]);

            $goal->current_amount += $validated['amount'];

            if ($goal->current_amount >= $goal->target_amount) {
                $goal->status = 'completed';
            }

            $goal->save();

            return $this->successResponse($goal, 'Progress added successfully');
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        }
    }

    /**
     * Get goal statistics.
     */
    public function statistics(Request $request)
    {
        $user = $request->user();

        $totalGoals = $user->savingsGoals()->count();
        $completedGoals = $user->savingsGoals()->where('status', 'completed')->count();
        $totalTarget = $user->savingsGoals()->sum('target_amount');
        $totalSaved = $user->savingsGoals()->sum('current_amount');

        return $this->successResponse([
            'total_goals' => $totalGoals,
            'completed_goals' => $completedGoals,
            'total_target' => $totalTarget,
            'total_saved' => $totalSaved,
            'completion_rate' => $totalGoals > 0 ? round(($completedGoals / $totalGoals) * 100, 2) : 0,
        ], 'Goal statistics retrieved successfully');
    }
}
