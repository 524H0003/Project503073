<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;

class Note extends Model
{
	protected $fillable = [
		"user_id",
		"title",
		"content",
		"is_pinned",
		"password",
	];

	protected $appends = ["is_locked"];

	// Casts nên để là function hoặc property tùy version Laravel (Laravel 11+ dùng function)
	protected function casts(): array
	{
		return [
			"password" => "hashed",
			"is_pinned" => "boolean", // Cast thẳng ở đây cho tiện
		];
	}

	public function getIsLockedAttribute(): bool
	{
		return !empty($this->password);
	}

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
		return Attribute::make(
			get: function ($value, $attributes) {
				$unlockedNotes = Session::get("unlocked_notes", []);

				if (
					empty($attributes["password"]) ||
					in_array($this->id, $unlockedNotes)
				) {
					return $value;
				}

				return "🔒 Nội dung này đã bị khóa.";
			},
			set: fn(?string $value) => $value ?? "",
		);
	}

	protected function title(): Attribute
	{
		return Attribute::make(set: fn(?string $value) => $value ?? "");
	}

	protected function isPinned(): Attribute
	{
		return Attribute::make(set: fn($value) => (bool) ($value ?? false));
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

	public function labels(): BelongsToMany
	{
		return $this->belongsToMany(Label::class);
	}

	public function setLabels(Request $request)
	{
		$validLabelIds = auth()
			->user()
			->labels()
			->whereIn("id", $request->label_ids ?? [])
			->pluck("id");

		$this->labels()->sync($validLabelIds);
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
