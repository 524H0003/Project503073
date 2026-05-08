<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Note extends Model
{
	protected $fillable = ["user_id", "title", "content", "is_pinned"];

	public function scopeOrdered($query)
	{
		return $query->orderByDesc("is_pinned")->orderByDesc("updated_at");
	}

	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}

	protected function content(): Attribute
	{
		return Attribute::make(set: fn(?string $value) => $value ?? "");
	}

	protected function title(): Attribute
	{
		return Attribute::make(set: fn(?string $value) => $value ?? "");
	}

	protected function is_pinned(): Attribute
	{
		return Attribute::make(set: fn(?boolval $value) => $value ?? false);
	}

	public function scopeSearch($query, ?string $search)
	{
		return $query->when($search, function ($query, $search) {
			$query->where(function ($q) use ($search) {
				$q->where("title", "like", "%{$search}%")->orWhere(
					"content",
					"like",
					"%{$search}%",
				);
			});
		});
	}
}
