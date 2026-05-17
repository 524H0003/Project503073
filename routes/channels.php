<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Note;

Broadcast::channel("notes.{noteId}", function ($user, $noteId) {
	$note = Note::find($noteId);

	if (!$note) {
		return false;
	}

	$hasPermission =
		$note->user_id === $user->id ||
		$note->sharedUsers()->where("user_id", $user->id)->exists();

	return $hasPermission;
});
