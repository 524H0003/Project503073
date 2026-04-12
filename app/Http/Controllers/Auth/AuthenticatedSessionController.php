<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
	// Xử lý đăng nhập
	public function store(Request $request)
	{
		$credentials = $request->validate([
			"email" => ["required", "email"],
			"password" => ["required"],
		]);

		if (Auth::attempt($credentials, $request->boolean("remember"))) {
			$request->session()->regenerate();

			return redirect("/");
		}

		return back()->withErrors([
			"email" => "Invalid login credential",
		]);
	}

	// Xử lý đăng xuất
	public function destroy(Request $request)
	{
		Auth::guard("web")->logout();
		$request->session()->invalidate();
		$request->session()->regenerateToken();

		return redirect("");
	}
}
