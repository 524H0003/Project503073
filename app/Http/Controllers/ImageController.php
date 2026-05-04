<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ImageController extends Controller
{
	public function upload(Request $request)
	{
		$request->validate([
			"image" => "required|image|mimes:jpeg,png,jpg,webp",
		]);

		if ($request->hasFile("image")) {
			$path = $request->file("image")->store("notes", "public");

			$url = "/storage/" . $path;

			return response()->json(["url" => $url]);
		}

		return response()->json(["message" => "Upload thất bại"], 400);
	}
}
