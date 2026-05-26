<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    use ApiResponse;

    /**
     * Get all transactions for the user.
     */
    public function index(Request $request)
    {
        $query = $request->user()->transactions();

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        // Search
        if ($request->has('search')) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        $transactions = $query->orderBy('date', 'desc')->paginate(20);

        return $this->paginatedResponse($transactions, 'Transactions retrieved successfully');
    }

    /**
     * Create a new transaction.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'category_id' => 'required|exists:categories,id',
                'type' => 'required|in:income,expense',
                'amount' => 'required|numeric|min:0.01',
                'description' => 'required|string|max:255',
                'date' => 'required|date',
                'receipt_url' => 'sometimes|url',
                'tags' => 'sometimes|array',
                'notes' => 'sometimes|string|max:1000',
            ]);

            $transaction = $request->user()->transactions()->create($validated);

            return $this->successResponse($transaction, 'Transaction created successfully', 201);
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        }
    }

    /**
     * Get a specific transaction.
     */
    public function show(Request $request, Transaction $transaction)
    {
        if ($transaction->user_id !== $request->user()->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        return $this->successResponse($transaction, 'Transaction retrieved successfully');
    }

    /**
     * Update a transaction.
     */
    public function update(Request $request, Transaction $transaction)
    {
        if ($transaction->user_id !== $request->user()->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        try {
            $validated = $request->validate([
                'category_id' => 'sometimes|exists:categories,id',
                'type' => 'sometimes|in:income,expense',
                'amount' => 'sometimes|numeric|min:0.01',
                'description' => 'sometimes|string|max:255',
                'date' => 'sometimes|date',
                'receipt_url' => 'sometimes|url',
                'tags' => 'sometimes|array',
                'notes' => 'sometimes|string|max:1000',
            ]);

            $transaction->update($validated);

            return $this->successResponse($transaction, 'Transaction updated successfully');
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        }
    }

    /**
     * Delete a transaction.
     */
    public function destroy(Request $request, Transaction $transaction)
    {
        if ($transaction->user_id !== $request->user()->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $transaction->delete();

        return $this->successResponse(null, 'Transaction deleted successfully');
    }

    /**
     * Get transaction statistics.
     */
    public function statistics(Request $request)
    {
        $user = $request->user();

        $startDate = $request->start_date ?? now()->startOfMonth();
        $endDate = $request->end_date ?? now()->endOfMonth();

        $income = $user->transactions()
            ->where('type', 'income')
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('amount');

        $expense = $user->transactions()
            ->where('type', 'expense')
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('amount');

        $balance = $income - $expense;

        return $this->successResponse([
            'income' => $income,
            'expense' => $expense,
            'balance' => $balance,
            'period' => [
                'start' => $startDate,
                'end' => $endDate,
            ],
        ], 'Statistics retrieved successfully');
    }
}
