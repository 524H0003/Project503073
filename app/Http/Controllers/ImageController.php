<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
	public function upload(Request $request, $noteId)
	{
		$request->validate([
			"image" => "required|image|mimes:jpeg,png,jpg,webp",
		]);

		if ($request->hasFile("image")) {
			$path = $request->file("image")->store("notes/{$noteId}");

			$url = route("notes.image", [
				"noteId" => $noteId,
				"filename" => basename($path),
			]);

			return response()->json(["url" => $url]);
		}

		return response()->json(["message" => "Upload thất bại"], 400);
	}

	public function serveImage($noteId, $filename)
	{
		$note = Note::findOrFail($noteId);

		Gate::authorize("view", $note);

		$path = "notes/{$noteId}/{$filename}";

		if (!Storage::disk("local")->exists($path)) {
			abort(404);
		}

		return Storage::disk("local")->response($path);
	}
}
