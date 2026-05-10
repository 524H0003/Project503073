<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
	// Xử lý lưu User
	public function store(Request $request)
{
    $request->validate([
        "display_name" => "required|string|max:255", 
        "email" => "required|string|lowercase|email|max:255|unique:" . User::class,
        "password" => ["required", "confirmed", Rules\Password::defaults()],
    ]);

    $user = User::create([
        "display_name" => $request->display_name,
        "email" => $request->email,
        "password" => Hash::make($request->password), 
    ]);

    event(new \Illuminate\Auth\Events\Registered($user));

    Auth::login($user); 

    return redirect("/");
}
}
