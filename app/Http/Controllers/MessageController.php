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
            $query->with('media')->with('user')->orderBy('created_at', 'DESC')->limit(100);
        })->first();

        return Inertia::render('Chat/Chat', [
            'chatID' => $chatID,
            'conversation' => $conversation
        ]);
    }

    public function store(Request $request, $chatID)
    {
        $request->validate([
            'message' => 'required_if:image,null|nullable|string',
            'type' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:10000',
        ]);
        $message = new Message;
        $message->message = $request->message;
        $message->conversation_id = $chatID;
        $message->user_id = auth()->id();
        $message->type = $request->image === null ? 'text' : 'file';
        $message->save();
        $image = $request->file('image');
        if ($image) {
            $newfilename = uniqid() . '_' . date('Ymdhms.') . $image->extension();
            $message->addMediaFromRequest('image')
                ->usingFileName($newfilename)
                ->toMediaCollection('images');
        }

        MessageEvent::dispatch($chatID, $message->load('user')->load('media'));
    }
}
