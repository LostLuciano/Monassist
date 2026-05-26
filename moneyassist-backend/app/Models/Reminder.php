<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'type',
        'due_date',
        'frequency',
        'status',
        'notification_sent',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'notification_sent' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
