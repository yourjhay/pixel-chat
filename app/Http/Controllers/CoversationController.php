<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\ConversationMember;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CoversationController extends Controller
{
    //

    public function index(Request $request)
    {
        $nickname = auth()->user();

        $conversations = Conversation::whereHas('members', function ($query) use ($nickname) {
            $query->where('user_id', $nickname?->id);
        })->orWhere('user_id', $nickname?->id)
            ->orWhere('type', 'public')
            ->orderBy('created_at', 'DESC')->paginate('30');

        return Inertia::render(
            'Conversation/Index',
            ['conversations' => $conversations, 'nickname' => $nickname?->nickname]
        );
    }


    /**
     * Create new room conversation
     *
     * @param Request $request
     * @return void
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:3|max:30',
        ]);

        $conversations = Conversation::where('user_id', auth()->id())->count();
        if ($conversations >= 10) {
            throw ValidationException::withMessages([
                'name' =>  'You can not create more than 10 chat rooms',
            ]);
        }

        $conversation = new Conversation;
        $conversation->user_id = auth()->id();
        $conversation->name = ucfirst($request->name);
        $conversation->type = $request->type;
        $conversation->save();

        $member = new ConversationMember();
        $member->conversation_id = $conversation->id;
        $member->user_id = auth()->id();
        $member->save();

        return redirect()->back();
    }
}
