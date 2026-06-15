<?php

use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('search', SearchController::class)->name('search');

    Route::resource('notes', NoteController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('bookmarks', BookmarkController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::resource('tasks', TaskController::class)->only(['index']);
    Route::patch('tasks/reorder', [TaskController::class, 'reorder'])->name('tasks.reorder');
});

require __DIR__.'/settings.php';
