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
        return back();
    }

    /**
     * Lưu ghi chú mới vào database
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'content' => 'string'
        ]);

        $note = $request->user()->notes()->create([
            'title' => $validated['title'],
            'content' => $validated['string'],
        ]);

       return Inertia::render('Note', [
            'note' => $note
        ]);
    }

    /**
     * Hiển thị form chỉnh sửa (Inertia page)
     */
    public function edit(Note $note)
    {
        $this->authorize('update', $note);

        return Inertia::render('Note', [
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
            'title' => 'string|max:255',
            'content' => 'string',
        ]);

        $note->update($validated);

        return back();
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
