<?php

namespace App\Http\Controllers;

use App\Models\Recommendation;
use App\Services\RecommendationService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    use ApiResponse;

    protected $recommendationService;

    public function __construct(RecommendationService $recommendationService)
    {
        $this->recommendationService = $recommendationService;
    }

    /**
     * Get all recommendations for the user.
     */
    public function index(Request $request)
    {
        $recommendations = $request->user()->recommendations()
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return $this->paginatedResponse($recommendations, 'Recommendations retrieved successfully');
    }

    /**
     * Generate new recommendations.
     */
    public function generate(Request $request)
    {
        try {
            $recommendations = $this->recommendationService->generateRecommendations($request->user());

            return $this->successResponse($recommendations, 'Recommendations generated successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to generate recommendations: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get a specific recommendation.
     */
    public function show(Request $request, Recommendation $recommendation)
    {
        if ($recommendation->user_id !== $request->user()->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        return $this->successResponse($recommendation, 'Recommendation retrieved successfully');
    }

    /**
     * Update recommendation status.
     */
    public function updateStatus(Request $request, Recommendation $recommendation)
    {
        if ($recommendation->user_id !== $request->user()->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,accepted,rejected,completed',
        ]);

        $recommendation->update($validated);

        return $this->successResponse($recommendation, 'Recommendation status updated successfully');
    }

    /**
     * Delete a recommendation.
     */
    public function destroy(Request $request, Recommendation $recommendation)
    {
        if ($recommendation->user_id !== $request->user()->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $recommendation->delete();

        return $this->successResponse(null, 'Recommendation deleted successfully');
    }

    /**
     * Get recommendation statistics.
     */
    public function statistics(Request $request)
    {
        $user = $request->user();

        $total = $user->recommendations()->count();
        $accepted = $user->recommendations()->where('status', 'accepted')->count();
        $completed = $user->recommendations()->where('status', 'completed')->count();
        $totalSavings = $user->recommendations()
            ->where('status', 'completed')
            ->sum('potential_savings');

        return $this->successResponse([
            'total_recommendations' => $total,
            'accepted' => $accepted,
            'completed' => $completed,
            'total_savings' => $totalSavings,
            'completion_rate' => $total > 0 ? round(($completed / $total) * 100, 2) : 0,
        ], 'Recommendation statistics retrieved successfully');
    }
}
