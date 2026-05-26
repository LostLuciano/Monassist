<?php

namespace App\Services;

use Google\Client;
use Google\Service\Generative;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected $client;
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
    }

    /**
     * Send a message to Gemini and get a response.
     */
    public function chat($message, $context = [], $type = 'general')
    {
        try {
            $prompt = $this->buildPrompt($message, $context, $type);

            // For now, return a mock response
            // In production, integrate with actual Gemini API
            return $this->getMockResponse($message, $type);
        } catch (\Exception $e) {
            Log::error('Gemini API Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Build a prompt for Gemini.
     */
    protected function buildPrompt($message, $context, $type)
    {
        $systemPrompt = "You are MoneyAssist, an AI-powered personal finance advisor. ";
        $systemPrompt .= "Help users manage their money, set goals, and make smart financial decisions. ";
        $systemPrompt .= "Be friendly, professional, and provide actionable advice.";

        if ($type === 'financial') {
            $systemPrompt .= " Focus on financial analysis and recommendations.";
        } elseif ($type === 'goal') {
            $systemPrompt .= " Focus on helping users achieve their savings goals.";
        } elseif ($type === 'transaction') {
            $systemPrompt .= " Focus on transaction categorization and analysis.";
        }

        $contextStr = "User Context: ";
        $contextStr .= "Total Income: " . ($context['total_income'] ?? 0) . ", ";
        $contextStr .= "Total Expense: " . ($context['total_expense'] ?? 0) . ", ";
        $contextStr .= "Active Goals: " . ($context['active_goals'] ?? 0);

        return $systemPrompt . "\n\n" . $contextStr . "\n\nUser Message: " . $message;
    }

    /**
     * Get a mock response (for development).
     */
    protected function getMockResponse($message, $type)
    {
        $responses = [
            'general' => "Thank you for your question! I'm here to help you manage your finances better. " .
                "Based on your current financial situation, I recommend reviewing your spending patterns " .
                "and setting clear financial goals. Would you like help with any specific area?",
            'financial' => "Based on your financial data, here are some insights: Your income-to-expense ratio " .
                "shows room for optimization. Consider allocating more towards savings and investments. " .
                "Would you like specific recommendations?",
            'goal' => "Great! Setting financial goals is an important step. I recommend breaking down your " .
                "goals into smaller milestones and tracking your progress regularly. What specific goal " .
                "would you like to work towards?",
            'transaction' => "I've analyzed your recent transactions. Your spending is well-distributed across " .
                "categories. Keep monitoring your expenses and look for opportunities to reduce unnecessary spending.",
        ];

        return $responses[$type] ?? $responses['general'];
    }

    /**
     * Analyze spending patterns.
     */
    public function analyzeSpending($transactions)
    {
        try {
            $analysis = [
                'total_spent' => $transactions->sum('amount'),
                'average_transaction' => $transactions->avg('amount'),
                'highest_category' => $transactions->groupBy('category_id')
                    ->map(fn($group) => $group->sum('amount'))
                    ->sortDesc()
                    ->first(),
                'trend' => 'stable',
            ];

            return $analysis;
        } catch (\Exception $e) {
            Log::error('Spending Analysis Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Generate financial insights.
     */
    public function generateInsights($user)
    {
        try {
            $insights = [];

            // Calculate metrics
            $totalIncome = $user->transactions()->where('type', 'income')->sum('amount');
            $totalExpense = $user->transactions()->where('type', 'expense')->sum('amount');
            $savingsRate = $totalIncome > 0 ? (($totalIncome - $totalExpense) / $totalIncome) * 100 : 0;

            if ($savingsRate < 10) {
                $insights[] = [
                    'type' => 'warning',
                    'message' => 'Your savings rate is below 10%. Consider reducing expenses or increasing income.',
                ];
            }

            if ($savingsRate > 30) {
                $insights[] = [
                    'type' => 'success',
                    'message' => 'Great job! Your savings rate is above 30%. Keep up the good work!',
                ];
            }

            return $insights;
        } catch (\Exception $e) {
            Log::error('Insights Generation Error: ' . $e->getMessage());
            throw $e;
        }
    }
}
