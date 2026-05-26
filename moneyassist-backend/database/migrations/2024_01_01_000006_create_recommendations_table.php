<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('type');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->decimal('potential_savings', 12, 2)->nullable();
            $table->string('implementation_difficulty')->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected', 'completed'])->default('pending');
            $table->json('data')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recommendations');
    }
};
