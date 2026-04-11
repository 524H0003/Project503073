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
        return Inertia::render('Notes/Index', [
            'notes' => Auth::user()->notes()->latest()->get()
        ]);
    }

    /**
     * Lưu ghi chú mới vào database
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $request->user()->notes()->create([
            'title' => $validated['title'],
            'content' => '', // Mặc định để trống như bạn yêu cầu
        ]);

        return back();
    }

    /**
     * Hiển thị form chỉnh sửa (Inertia page)
     */
    public function edit(Note $note)
    {
        // Đảm bảo người dùng chỉ được sửa ghi chú của chính họ
        $this->authorize('update', $note);

        return Inertia::render('Notes/Edit', [
            'note' => $note
        ]);
    }

    /**
     * Cập nhật ghi chú
     */
    public function update(Request $request, Note $note)
    {
        $this->authorize('update', $note);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $note->update($validated);

        return redirect()->route('notes.index')->with('message', 'Đã cập nhật ghi chú!');
    }

    /**
     * Xóa ghi chú
     */
    public function destroy(Note $note)
    {
        $this->authorize('delete', $note);

        $note->delete();

        return back(200);
    }
}
