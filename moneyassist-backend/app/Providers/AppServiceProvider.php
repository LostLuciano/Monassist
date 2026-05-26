<?php

namespace App\Providers;

use App\Services\GeminiService;
use App\Services\RecommendationService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(GeminiService::class, function ($app) {
            return new GeminiService();
        });

        $this->app->singleton(RecommendationService::class, function ($app) {
            return new RecommendationService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
