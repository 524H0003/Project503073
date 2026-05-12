<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;

class PasswordResetLinkController extends Controller
{
	// 1. Hiển thị trang nhập Email (Giao diện)
	public function create()
	{
		return Inertia::render("Auth/ForgotPassword");
	}

	// 2. Xử lý gửi link khôi phục mật khẩu vào Email
	public function store(Request $request)
	{
		$request->validate(["email" => "required|email"]);

		// Gửi link thông qua Broker mặc định của Laravel
		$status = Password::broker()->sendResetLink($request->only("email"));

		// Trả về kết quả cho Frontend
		if ($status === Password::RESET_LINK_SENT) {
			return back()->with("status", __($status));
		}

		return back()->withErrors(["email" => __($status)]);
	}
}
