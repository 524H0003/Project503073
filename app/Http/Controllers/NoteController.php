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
	 * Cập nhật ghi chú (Tiêu đề, Nội dung, Nhãn, Thiết lập Mật khẩu ban đầu)
	 */
	public function update(Request $request, Note $note)
	{
		$this->authorize("update", $note);

		// Lớp bảo vệ: Kiểm tra xem ghi chú có đang bị khóa hay không
		$unlockedNotes = session("unlocked_notes", []);
		$isCurrentlyLocked =
			!empty($note->getAttributes()["password"]) &&
			!in_array($note->id, $unlockedNotes);

		$validated = $request->validate([
			"title" => "nullable|string|max:255",
			"content" => "nullable|string",
			"password" => "nullable|string|min:4|confirmed",
			"labels" => "nullable|array",
			"labels.*" => "exists:labels,id",
		]);

		// Nếu ghi chú ĐANG BỊ KHÓA, chặn đứng mọi hành vi sửa Title, Content hoặc đổi danh sách Labels
		if ($isCurrentlyLocked) {
			if (
				$request->has("content") ||
				$request->has("title") ||
				$request->has("labels")
			) {
				return back()->withErrors([
					"message" =>
						"Bạn cần phải mở khóa ghi chú này trước khi chỉnh sửa hoặc thay đổi cấu trúc.",
				]);
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

		// Chỉ cho phép gán mật khẩu ban đầu nếu chưa từng có mật khẩu
		if (
			$request->filled("password") &&
			empty($note->getAttributes()["password"])
		) {
			$note->password = $validated["password"];
		}

		$note->save();

		// Cập nhật nhãn (Chỉ thực hiện khi không bị khóa)
		if ($request->has("labels") && !$isCurrentlyLocked) {
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
	 * Xóa ghi chú (Chỉ cho phép xóa khi ghi chú không khóa hoặc đã được mở khóa)
	 */
	public function destroy(Note $note)
	{
		$this->authorize("delete", $note);

		$hasPassword = !empty($note->getAttributes()["password"]);

		if ($hasPassword) {
			$unlockedNotes = session("unlocked_notes", []);
			$isCurrentlyUnlocked = in_array($note->id, $unlockedNotes);

			// Nếu ghi chú có mật khẩu nhưng CHƯA ĐƯỢC MỞ KHÓA, chặn hành động xóa ngay lập tức
			if (!$isCurrentlyUnlocked) {
				return back()->withErrors([
					"message" => "Bạn cần phải mở khóa ghi chú này trước khi xóa.",
				]);
			}

			// Dọn dẹp Session
			$unlockedNotes = array_diff($unlockedNotes, [$note->id]);
			session()->put("unlocked_notes", $unlockedNotes);
		}

		$note->delete();

		return redirect()->route("notes.index");
	}

	/**
	 * Ghim / Bỏ ghim ghi chú (Double Protection Layer)
	 */
	public function togglePin(Note $note)
	{
		$this->authorize("update", $note);

		// Lớp bảo vệ: Kiểm tra nếu note có mật khẩu và chưa unlock thì KHÔNG cho phép ghim
		$hasPassword = !empty($note->getAttributes()["password"]);
		if ($hasPassword) {
			$unlockedNotes = session("unlocked_notes", []);
			if (!in_array($note->id, $unlockedNotes)) {
				return back()->withErrors([
					"message" =>
						"Bạn cần phải mở khóa ghi chú này trước khi thay đổi trạng thái ghim.",
				]);
			}
		}

		$note->update([
			"pinned_at" => $note->pinned_at ? null : now(),
		]);

		return back();
	}

	/**
	 * Mở khóa ghi chú (Xác thực mật khẩu đưa vào Session)
	 */
	public function unlock(Request $request, Note $note)
	{
		$request->validate([
			"password" => "required|string",
		]);

		if (!Hash::check($request->password, $note->password)) {
			return back()->withErrors([
				"password" => "Mật khẩu mở khóa ghi chú không chính xác.",
			]);
		}

		$unlocked = Session::get("unlocked_notes", []);
		if (!in_array($note->id, $unlocked)) {
			$unlocked[] = $note->id;
			Session::put("unlocked_notes", $unlocked);
		}

		$note->refresh();
		$note->load("labels:id,name");

		return back();
	}

	/**
	 * Khóa lại ghi chú chủ động
	 */
	public function lock(Note $note)
	{
		$hasPassword = !empty($note->getAttributes()["password"]);

		if ($hasPassword) {
			$unlocked = Session::get("unlocked_notes", []);
			$unlocked = array_diff($unlocked, [$note->id]);
			Session::put("unlocked_notes", $unlocked);
			$note->refresh();
		}

		$note->load("labels:id,name");

		return back();
	}

	/**
	 * Thay đổi mật khẩu ghi chú (Yêu cầu phải unlock trước đó)
	 */
	public function changePassword(Request $request, Note $note)
	{
		$this->authorize("update", $note);

		$unlocked = Session::get("unlocked_notes", []);
		if (!in_array($note->id, $unlocked)) {
			return back()->withErrors([
				"message" =>
					"Bạn cần phải mở khóa ghi chú trước khi tiến hành đổi mật khẩu mới.",
			]);
		}

		$rules = [
			"new_password" => "required|string|min:4|confirmed",
		];

		$validated = $request->validate($rules);

		$note->password = $validated["new_password"];
		$note->save();

		$note->refresh();
		$note->load("labels:id,name");

		return back();
	}

	/**
	 * Tắt tính năng bảo mật bằng mật khẩu của ghi chú
	 */
	public function disablePassword(Note $note)
	{
		$this->authorize("update", $note);

		$hasPassword = !empty($note->getAttributes()["password"]);
		if (!$hasPassword) {
			return back()->withErrors([
				"message" => "Ghi chú này hiện không có mật khẩu cấu hình.",
			]);
		}

		// Bắt buộc ghi chú phải đang ở trạng thái mở khóa trong session mới được quyền gỡ bỏ bảo mật
		$unlockedNotes = session("unlocked_notes", []);
		if (!in_array($note->id, $unlockedNotes)) {
			return back()->withErrors([
				"message" =>
					"Bạn cần phải mở khóa ghi chú này trước khi tắt mật khẩu bảo vệ.",
			]);
		}

		$note->password = null;
		$note->save();

		// Xóa khỏi danh sách đã unlock vì cấu trúc note đã trở về trạng thái bình thường
		$unlockedNotes = array_diff($unlockedNotes, [$note->id]);
		session()->put("unlocked_notes", $unlockedNotes);

		$note->refresh();
		$note->load("labels:id,name");

		return back();
	}
}
