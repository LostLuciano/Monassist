<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Services\GeminiService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ChatController extends Controller
{
    use ApiResponse;

    protected $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Get chat history for the user.
     */
    public function history(Request $request)
    {
        $messages = $request->user()->chatMessages()
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return $this->paginatedResponse($messages, 'Chat history retrieved successfully');
    }

    /**
     * Send a message and get AI response.
     */
    public function sendMessage(Request $request)
    {
        try {
            $validated = $request->validate([
                'message' => 'required|string|max:2000',
                'type' => 'sometimes|in:general,financial,goal,transaction',
            ]);

            // Get user context
            $userContext = [
                'total_income' => $request->user()->transactions()->where('type', 'income')->sum('amount'),
                'total_expense' => $request->user()->transactions()->where('type', 'expense')->sum('amount'),
                'active_goals' => $request->user()->savingsGoals()->where('status', 'active')->count(),
            ];

            // Get AI response
            $response = $this->geminiService->chat(
                $validated['message'],
                $userContext,
                $validated['type'] ?? 'general'
            );

            // Save message
            $chatMessage = $request->user()->chatMessages()->create([
                'message' => $validated['message'],
                'response' => $response,
                'type' => $validated['type'] ?? 'general',
                'context' => $userContext,
            ]);

            return $this->successResponse([
                'id' => $chatMessage->id,
                'message' => $chatMessage->message,
                'response' => $chatMessage->response,
                'type' => $chatMessage->type,
                'created_at' => $chatMessage->created_at,
            ], 'Message sent successfully', 201);
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to get AI response: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get a specific message.
     */
    public function show(Request $request, ChatMessage $message)
    {
        if ($message->user_id !== $request->user()->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        return $this->successResponse($message, 'Message retrieved successfully');
    }

    /**
     * Delete a message.
     */
    public function destroy(Request $request, ChatMessage $message)
    {
        if ($message->user_id !== $request->user()->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $message->delete();

        return $this->successResponse(null, 'Message deleted successfully');
    }

    /**
     * Clear chat history.
     */
    public function clearHistory(Request $request)
    {
        $request->user()->chatMessages()->delete();

        return $this->successResponse(null, 'Chat history cleared successfully');
    }
}
