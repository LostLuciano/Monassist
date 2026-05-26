<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavingsGoal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'target_amount',
        'current_amount',
        'deadline',
        'category',
        'icon',
        'color',
        'priority',
        'status',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
        'deadline' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getProgressPercentageAttribute()
    {
        if ($this->target_amount == 0) {
            return 0;
        }
        return round(($this->current_amount / $this->target_amount) * 100, 2);
    }
}
