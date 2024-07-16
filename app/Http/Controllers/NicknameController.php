<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class NicknameController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nickname' => 'required|string|max:15|min:2|unique:users,nickname',
            'pin' => 'required|numeric|digits:4',
        ]);
        $nickname = new User();
        $nickname->nickname = $request->nickname;
        $nickname->password = Hash::make($request->pin);
        $nickname->save();

        Auth::login($nickname, true);


        return redirect()->route('conversation');
    }
}
