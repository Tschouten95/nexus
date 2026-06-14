<?php

use App\Http\Controllers\NoteController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('notes', NoteController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::resource('tasks', TaskController::class)->only(['index']);
    Route::patch('tasks/reorder', [TaskController::class, 'reorder'])->name('tasks.reorder');
});

require __DIR__.'/settings.php';
