<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'type',
        'priority',
        'potential_savings',
        'implementation_difficulty',
        'status',
        'data',
    ];

    protected $casts = [
        'potential_savings' => 'decimal:2',
        'data' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
