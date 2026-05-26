<?php

namespace App\Services;

use App\Models\Recommendation;
use Illuminate\Support\Facades\Log;

class RecommendationService
{
    /**
     * Generate recommendations for a user.
     */
    public function generateRecommendations($user)
    {
        try {
            $recommendations = [];

            // Analyze spending patterns
            $spendingAnalysis = $this->analyzeSpending($user);

            // Generate recommendations based on analysis
            if ($spendingAnalysis['high_category_percentage'] > 40) {
                $recommendations[] = [
                    'title' => 'Reduce High Category Spending',
                    'description' => 'Your ' . $spendingAnalysis['highest_category'] . ' spending is ' .
                        $spendingAnalysis['high_category_percentage'] . '% of total expenses. Consider reducing this.',
                    'type' => 'spending_reduction',
                    'priority' => 'high',
                    'potential_savings' => $spendingAnalysis['highest_category_amount'] * 0.2,
                    'implementation_difficulty' => 'medium',
                ];
            }

            // Check savings rate
            if ($spendingAnalysis['savings_rate'] < 10) {
                $recommendations[] = [
                    'title' => 'Increase Savings Rate',
                    'description' => 'Your current savings rate is ' . $spendingAnalysis['savings_rate'] .
                        '%. Aim for at least 20% of your income.',
                    'type' => 'savings_increase',
                    'priority' => 'high',
                    'potential_savings' => $spendingAnalysis['monthly_income'] * 0.1,
                    'implementation_difficulty' => 'medium',
                ];
            }

            // Check for budget optimization
            if ($spendingAnalysis['monthly_expense'] > $spendingAnalysis['monthly_income'] * 0.8) {
                $recommendations[] = [
                    'title' => 'Budget Optimization',
                    'description' => 'Your expenses are ' . round(($spendingAnalysis['monthly_expense'] /
                        $spendingAnalysis['monthly_income']) * 100) . '% of income. Review and optimize your budget.',
                    'type' => 'budget_optimization',
                    'priority' => 'high',
                    'potential_savings' => $spendingAnalysis['monthly_expense'] * 0.15,
                    'implementation_difficulty' => 'high',
                ];
            }

            // Save recommendations to database
            foreach ($recommendations as $rec) {
                Recommendation::create([
                    'user_id' => $user->id,
                    'title' => $rec['title'],
                    'description' => $rec['description'],
                    'type' => $rec['type'],
                    'priority' => $rec['priority'],
                    'potential_savings' => $rec['potential_savings'],
                    'implementation_difficulty' => $rec['implementation_difficulty'],
                    'status' => 'pending',
                    'data' => $rec,
                ]);
            }

            return $recommendations;
        } catch (\Exception $e) {
            Log::error('Recommendation Generation Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Analyze user spending patterns.
     */
    protected function analyzeSpending($user)
    {
        $transactions = $user->transactions()
            ->where('type', 'expense')
            ->where('date', '>=', now()->subMonths(3))
            ->get();

        $totalExpense = $transactions->sum('amount');
        $monthlyExpense = $totalExpense / 3;

        $income = $user->transactions()
            ->where('type', 'income')
            ->where('date', '>=', now()->subMonths(3))
            ->sum('amount');
        $monthlyIncome = $income / 3;

        $categoryExpenses = $transactions->groupBy('category_id')
            ->map(fn($group) => $group->sum('amount'))
            ->sortDesc();

        $highestCategory = $categoryExpenses->first() ?? 0;
        $highestCategoryPercentage = $totalExpense > 0 ? ($highestCategory / $totalExpense) * 100 : 0;

        $savingsRate = $monthlyIncome > 0 ? (($monthlyIncome - $monthlyExpense) / $monthlyIncome) * 100 : 0;

        return [
            'monthly_income' => $monthlyIncome,
            'monthly_expense' => $monthlyExpense,
            'savings_rate' => $savingsRate,
            'highest_category_amount' => $highestCategory,
            'high_category_percentage' => $highestCategoryPercentage,
            'highest_category' => 'top category',
            'total_expense' => $totalExpense,
        ];
    }
}
