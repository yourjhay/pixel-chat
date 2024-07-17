<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Auth\GenericUser;


// Route::post('/broadcasting/auth', function () {
//     $user = new GenericUser(['id' => microtime()]);
//     request()->setUserResolver(function () use ($user) {
//         return $user;
//     });
//     return Broadcast::auth(request());
// });

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.{id}', function ($user, Conversation $id) {
    return $user->canJoinRoom($id) ? $user : false;
});

Broadcast::channel('user-rooms.{id}', function ($user, $id) {
    return $user->id === (int) $id;
});
