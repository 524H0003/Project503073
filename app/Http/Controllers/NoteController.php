<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
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

		$unlockedNotes = session("unlocked_notes", []);
		$isUnlocked = empty($note->password) || in_array($note->id, $unlockedNotes);

		$validated = $request->validate([
			"title" => "nullable|string|max:255",
			"content" => "nullable|string",
			"password" => "nullable|string|min:4",
			"labels" => "nullable|array",
			"labels.*" => "exists:labels,id",
		]);

		if ($request->has("content") || $request->has("title")) {
			if (!$isUnlocked) {
				return back()->with(
					"message",
					"You need to unlock note to edit content",
				);
			}
		}

		$note->fill([
			"title" => $request->has("title")
				? $validated["title"] ?? ""
				: $note->title,
			"content" => $request->has("content")
				? $validated["content"] ?? ""
				: $note->content,
		]);

		if ($request->filled("password")) {
			$note->password = $validated["password"];
		}

		$note->save();

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
		$this->authorize("update", $note);

		$note->update([
			"is_pinned" => !$note->is_pinned,
		]);

		return back();
	}

	public function unlock(Request $request, Note $note)
	{
		$request->validate([
			"password" => "required|string",
		]);

		if (!Hash::check($request->password, $note->password)) {
			return back()->with("message", "Wrong password");
		}

		$unlocked = Session::get("unlocked_notes", []);
		if (!in_array($note->id, $unlocked)) {
			$unlocked[] = $note->id;
			Session::put("unlocked_notes", $unlocked);
		}

		return back();
	}

	public function lock(Note $note)
	{
		$unlocked = Session::get("unlocked_notes", []);

		$unlocked = array_diff($unlocked, [$note->id]);

		Session::put("unlocked_notes", $unlocked);

		return back()->with("message", "Note locked");
	}
}
