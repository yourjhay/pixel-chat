<?php

use App\Http\Controllers\ConversationMemberController;
use App\Http\Controllers\CoversationController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NicknameController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\URL;
use App\Http\Middleware\CustomConfirmPassword;


if (env('APP_ENV') === 'production') {
    URL::forceScheme('https');
}

Route::get('/', function () {
    return redirect('/conversation');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/conversation', [CoversationController::class, 'index'])->name('conversation');
Route::post('/nickname', [NicknameController::class, 'store'])->name('nickname');

Route::middleware('auth')->group(function () {
    Route::post('/conversation', [CoversationController::class, 'store'])->name('conversation.new');
    Route::post('/coversation/add-user', [ConversationMemberController::class, 'store'])->name('conversation.user.add');
    Route::post('/coversation/leave/{chatID}', [ConversationMemberController::class, 'leave'])->name('conversation.leave')->middleware('password.confirm');
    Route::get('/chat/{chatID}', [MessageController::class, 'index'])->name('chat')->middleware(CustomConfirmPassword::class);
    Route::post('/chat/{chatID}', [MessageController::class, 'store'])->name('chat.send')->middleware('throttle:10,1');
    Route::get('/chat/details/{chatID}', [MessageController::class, 'details'])->name('chat.details');
});

require __DIR__ . '/auth.php';
