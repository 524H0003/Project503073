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
		$note = $request
			->user()
			->notes()
			->create([
				"title" => "",
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

		$note->load("labels:id,name");

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
			"labels" => "nullable|array",
			"labels.*" => "exists:labels,id",
		]);

		$note->update([
			"title" => $validated["title"] ?? "",
			"content" => $validated["content"] ?? "",
		]);

		if ($request->has("labels")) {
			$validIds = auth()
				->user()
				->labels()
				->whereIn("labels.id", $request->labels)
				->pluck("id");

			$note->labels()->sync($validIds);
		}

		$note->load("labels:id,name");

		return back();
	}

	/**
	 * Xóa ghi chú
	 */
	public function destroy(Note $note)
	{
		$this->authorize("delete", $note);

		$note->delete();

		return redirect()->route("notes.index");
	}

	public function togglePin(Note $note)
	{
		$note->update([
			"pinned_at" => $note->pinned_at ? null : now(),
		]);

		return back();
	}
}
