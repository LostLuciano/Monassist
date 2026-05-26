<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type');
            $table->dateTime('due_date');
            $table->string('frequency')->nullable();
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->boolean('notification_sent')->default(false);
            $table->timestamps();
            $table->index(['user_id', 'due_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
};
