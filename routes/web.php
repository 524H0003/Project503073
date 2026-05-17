<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\ImageController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;

Route::get("/", function () {
	return Inertia::render("Index");
})->name("index");

Route::post("/login", [AuthenticatedSessionController::class, "store"])->name(
	"login",
);

Route::post("/logout", [AuthenticatedSessionController::class, "destroy"])
	->middleware("auth")
	->name("logout");

Route::middleware(["auth"])->group(function () {
	Route::resource("notes", NoteController::class);
});

Route::get("/verify-email", function () {
	return Inertia::render("Auth/VerifyEmail", ["status" => session("status")]);
})
	->middleware("auth")
	->name("verification.notice");

Route::get("/verify-email/{id}/{hash}", function (
	EmailVerificationRequest $request,
) {
	$request->fulfill();
	return redirect("/");
})
	->middleware(["auth", "signed"])
	->name("verification.verify");

Route::post("/email/verification-notification", function (Request $request) {
	$request->user()->sendEmailVerificationNotification();
	return back()->with("status", "verification-link-sent");
})
	->middleware(["auth", "throttle:6,1"])
	->name("verification.send");

Route::middleware("guest")->group(function () {
	Route::post("register", [RegisteredUserController::class, "store"]);
	Route::get("forgot-password", [
		PasswordResetLinkController::class,
		"create",
	])->name("password.request");
	Route::post("forgot-password", [
		PasswordResetLinkController::class,
		"store",
	])->name("password.email");
	Route::get("reset-password/{token}", [
		NewPasswordController::class,
		"create",
	])->name("password.reset");
	Route::post("reset-password", [NewPasswordController::class, "store"])->name(
		"password.update",
	);
});

Route::middleware("auth")->group(function () {
	Route::post("/notes/{note}/unlock", [NoteController::class, "unlock"])->name(
		"notes.unlock",
	);

	Route::post("/notes/{note}/lock", [NoteController::class, "lock"])->name(
		"notes.lock",
	);

	Route::post("/notes/{note}/change-password", [
		NoteController::class,
		"changePassword",
	])->name("notes.changePassword");

	Route::post("/notes/{note}/disable-password", [
		NoteController::class,
		"disablePassword",
	])->name("notes.disablePassword");

	Route::post("/notes/{noteId}/image", [
		ImageController::class,
		"upload",
	])->name("notes.upload-image");

	Route::get("/notes/{noteId}/image/{filename}", [
		ImageController::class,
		"serveImage",
	])
		->name("notes.image")
		->middleware("auth");

	Route::get("/profile", [ProfileController::class, "edit"])->name(
		"profile.edit",
	);
	Route::post("/profile", [ProfileController::class, "update"])->name(
		"profile.update",
	);
	Route::put("/password", [ProfileController::class, "updatePassword"])->name(
		"profile.password.update",
	);
	Route::put("/profile/preferences", [
		ProfileController::class,
		"updatePreferences",
	])->name("profile.preferences.update");

	Route::patch("/notes/{note}/toggle-pin", [
		NoteController::class,
		"togglePin",
	])->name("notes.togglePin");

	Route::resource("labels", LabelController::class);
});
