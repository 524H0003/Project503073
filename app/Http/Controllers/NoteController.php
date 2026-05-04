<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class NoteController extends Controller
{
	/**
	 * Hiển thị danh sách ghi chú của người dùng
	 */
	public function index()
	{
		return redirect("/");
	}

	/**
	 * Lưu ghi chú mới vào database
	 */
	public function store(Request $request)
	{
		$validated = $request->validate([
			"title" => "string|max:255",
		]);

		$note = $request
			->user()
			->notes()
			->create([
				"title" => $validated["title"],
				"content" => "",
			]);

		return redirect()->route("notes.edit", $note->id);
	}

	/**
	 * Hiển thị form chỉnh sửa (Inertia page)
	 */
	public function edit(Note $note)
	{
		$this->authorize("update", $note);

		return Inertia::render("Note", [
			"note" => $note,
		]);
	}

	public function show(Note $note)
	{
		return redirect()->route("notes.edit", $note->id);
	}

	/**
	 * Cập nhật ghi chú
	 */
	public function update(Request $request, Note $note)
	{
		$this->authorize("update", $note);

		$validated = $request->validate([
			"title" => "nullable|string|max:255",
			"content" => "nullable|string",
		]);

		$note->fill($validated);

		if ($note->isDirty()) {
			$note->update([
				"title" => $validated["title"] ?? "",
				"content" => $validated["content"] ?? "",
			]);
		}

		return back();
	}

	/**
	 * Xóa ghi chú
	 */
	public function destroy(Note $note)
	{
		$this->authorize("delete", $note);

		$note->delete();

		return redirect("/");
	}
}
