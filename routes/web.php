<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\NoteController;

Route::get("/", function () {
	return Inertia::render("Index");
});

Route::post("/login", [AuthenticatedSessionController::class, "store"]);

Route::post("/logout", [
	AuthenticatedSessionController::class,
	"destroy",
])->middleware("auth");

Route::middleware("guest")->group(function () {
	Route::post("register", [RegisteredUserController::class, "store"]);
});

Route::middleware(["auth", "verified"])->group(function () {
	Route::resource("notes", NoteController::class);
});
