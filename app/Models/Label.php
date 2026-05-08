<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Label extends Model
{
	protected $fillable = ["user_id", "name"];

	// Nhãn thuộc về một người dùng
	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}

	// Nhãn có thể gắn cho nhiều ghi chú
	public function notes(): BelongsToMany
	{
		return $this->belongsToMany(Note::class);
	}
}
