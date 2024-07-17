<?php

namespace App\Http\Controllers;

use App\Events\UserAddedToRoom;
use App\Models\Conversation;
use App\Models\ConversationMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ConversationMemberController extends Controller
{
    public function store(Request $request)
    {

        $request->validate([
            'nickname' => 'required|string|min:3|max:15',
            'conversation_id' => 'required|numeric',
        ]);

        $user = User::where('nickname', $request->nickname)->where('id', '!=', auth()->id())->first();
        $conversation = ConversationMember::where('conversation_id', $request->conversation_id)->where('user_id', $user?->id)->first();


        if ($conversation) {
            throw ValidationException::withMessages([
                'nickname' =>  $request->nickname . ' is already in this conversation',
            ]);
        }
        if (!$user) {
            throw ValidationException::withMessages([
                'nickname' => 'User with ' . $request->nickname . ' not found',
            ]);
        }

        $member = new ConversationMember();
        $member->conversation_id = $request->conversation_id;
        $member->user_id = $user->id;
        $member->save();
        $member->load('conversation');
        UserAddedToRoom::dispatch($user, $member->conversation);
    }
}
