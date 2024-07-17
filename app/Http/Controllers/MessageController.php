<?php

namespace App\Http\Controllers;

use App\Events\MessageEvent;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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


        if (auth()->user()->canJoinRoom($conversation) == false) {
            return abort(403, 'You  cannot join this conversation');
        }


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
            'message_attachment' => 'nullable|mimes:jpeg,png,jpg,webp,mp4,mov,webm|max:10240',
        ]);
        try {
            DB::beginTransaction();
            $message = new Message;
            $message->message = $request->message;
            $message->conversation_id = $chatID;
            $message->user_id = auth()->id();
            $message->type = $request->message_attachment === null ? 'text' : 'file';
            $message->save();
            $image = $request->file('message_attachment');
            if ($image) {
                $newfilename = uniqid() . '_' . date('Ymdhms.') . $image->extension();
                $message->addMediaFromRequest('message_attachment')
                    ->usingFileName($newfilename)
                    ->toMediaCollection('attachments');
            }
            $message->conversation()->touch();
            MessageEvent::dispatch($chatID, $message->load('user')->load('media'));
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
