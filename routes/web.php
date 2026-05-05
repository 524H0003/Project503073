<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\ImageController;

Route::get("/", function () {
	return Inertia::render("Index");
});

Route::post("/login", [AuthenticatedSessionController::class, "store"])->name(
	"login",
);

Route::post("/logout", [AuthenticatedSessionController::class, "destroy"])
	->middleware("auth")
	->name("logout");

Route::middleware("guest")->group(function () {
	Route::post("register", [RegisteredUserController::class, "store"]);
});

Route::middleware(["auth", "verified"])->group(function () {
	Route::post("/notes/{noteId}/image", [ImageController::class, "upload"])->name(
		"notes.upload-image",
	);

	Route::get("/notes/{noteId}/image/{filename}", [
		ImageController::class,
		"serveImage",
	])
		->name("notes.image")
		->middleware("auth");

	Route::resource("notes", NoteController::class);
});
