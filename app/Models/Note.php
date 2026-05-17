<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class Note extends Model
{
	protected $fillable = [
		"user_id",
		"title",
		"content",
		"pinned_at",
		"password",
	];

	protected $hidden = ["password"];

	protected $appends = ["is_locked", "is_opened", "current_user_permission"];

	protected function casts(): array
	{
		return [
			"password" => "hashed",
			"pinned_at" => "datetime",
		];
	}

	public function getIsLockedAttribute(): bool
	{
		$attributes = $this->getAttributes();
		return !empty($attributes["password"]);
	}

	public function getIsOpenedAttribute(): bool
	{
		if (!$this->is_locked) {
			return true;
		}

		$unlockedNotes = session("unlocked_notes", []);
		return in_array($this->id, $unlockedNotes);
	}

	public function scopeOrdered($query)
	{
		return $query
			->orderByRaw("pinned_at IS NULL ASC")
			->orderByDesc("pinned_at")
			->orderByDesc("updated_at");
	}

	public function getCurrentUserPermissionAttribute(): ?string
	{
		$userId = Auth::id();
		if (!$userId) {
			return null;
		}

		if ($this->user_id === $userId) {
			return "owner";
		}

		$shared = $this->sharedUsers()->where("user_id", $userId)->first();
		return $shared ? $shared->pivot->permission : null;
	}

	public function sharedUsers(): BelongsToMany
	{
		return $this->belongsToMany(User::class, "note_user")
			->withPivot("permission")
			->withTimestamps();
	}

	/**
	 * Chủ sở hữu ghi chú
	 */
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

				return null;
			},
			set: fn(?string $value) => $value ?? "",
		);
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
