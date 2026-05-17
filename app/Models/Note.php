<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Note extends Model
{
	protected $fillable = ["user_id", "title", "content", "pinned_at"];

	protected function casts(): array
	{
		return [
			"pinned_at" => "datetime",
		];
	}

	public function scopeOrdered($query)
	{
		return $query
			->orderByRaw("pinned_at IS NULL ASC")
			->orderByDesc("pinned_at")
			->orderByDesc("updated_at");
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

	// --- Các hàm xử lý Label và Tìm kiếm giữ nguyên ---

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

	public function labels(): BelongsToMany
	{
		return $this->belongsToMany(Label::class);
	}

	public function scopeFilterByLabels($query, $labelIds)
	{
		if (!$labelIds) {
			return $query;
		}

		$ids = is_array($labelIds) ? $labelIds : [$labelIds];

		return $query->whereHas("labels", function ($q) use ($ids) {
			$q->whereIn("labels.id", $ids);
		});
	}
}
