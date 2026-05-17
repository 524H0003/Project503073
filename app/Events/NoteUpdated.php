<?php

namespace App\Events;

use App\Models\Note;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NoteUpdated implements ShouldBroadcastNow
{
	use Dispatchable, InteractsWithSockets, SerializesModels;

	public $note;

	public function __construct(Note $note)
	{
		$this->note = $note;
	}

	// 🔴 KHAI BÁO TÊN KÊNH: Đồng bộ với kênh Private `notes.${noteId}` ở React
	public function broadcastOn(): array
	{
		return [new PrivateChannel("notes." . $this->note->id)];
	}

	// Tùy biến tên sự kiện gửi đi (để React lắng nghe chính xác dấu chấm ".NoteUpdated")
	public function broadcastAs(): string
	{
		return "NoteUpdated";
	}
}
