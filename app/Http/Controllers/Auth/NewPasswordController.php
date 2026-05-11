<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class NewPasswordController extends Controller
{
    /**
     * Hiển thị trang đặt lại mật khẩu mới (Giao diện)
     */
    public function create(Request $request)
    {
        return Inertia::render('Auth/ResetPassword', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }

    /**
     * Xử lý lưu mật khẩu mới vào Database
     */
    public function store(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Thực hiện reset mật khẩu thông qua Broker
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password), 
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        // Nếu thành công, chuyển hướng về trang Login
        if ($status == Password::PASSWORD_RESET) {
            return redirect()->route('index')->with('status', __($status));
        }

        // Nếu thất bại, quay lại với lỗi
        return back()->withInput($request->only('email'))
            ->withErrors(['email' => __($status)]);
    }
}