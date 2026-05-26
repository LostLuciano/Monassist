<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar_url',
        'bio',
        'currency',
        'language',
        'theme',
        'notifications_enabled',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'notifications_enabled' => 'boolean',
    ];

    /**
     * Get the transactions for the user.
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get the savings goals for the user.
     */
    public function savingsGoals()
    {
        return $this->hasMany(SavingsGoal::class);
    }

    /**
     * Get the chat messages for the user.
     */
    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class);
    }

    /**
     * Get the recommendations for the user.
     */
    public function recommendations()
    {
        return $this->hasMany(Recommendation::class);
    }

    /**
     * Get the reminders for the user.
     */
    public function reminders()
    {
        return $this->hasMany(Reminder::class);
    }

    /**
     * Get the categories for the user.
     */
    public function categories()
    {
        return $this->hasMany(Category::class);
    }
}
