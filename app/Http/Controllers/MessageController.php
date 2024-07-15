<?php

namespace App\Http\Controllers;

use App\Events\MessageEvent;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    //

    public function index(Request $request, $chatID)
    {
        $conversation = Conversation::where('id', $chatID)->with('messages', function ($query) {
            $query->with('user')->orderBy('created_at', 'DESC')->limit(100);
        })->first();

        return Inertia::render('Chat/Chat', [
            'chatID' => $chatID,
            'conversation' => $conversation
        ]);
    }

    public function store(Request $request, $chatID)
    {
        $request->validate([
            'message' => 'required|string',
            'type' => 'required|string',
        ]);
        $message = new Message;
        $message->message = $request->message;
        $message->conversation_id = $chatID;
        $message->user_id = auth()->id();
        $message->type = $request->type;
        $message->save();
        MessageEvent::dispatch($chatID, $message->load('user'));
    }
}
