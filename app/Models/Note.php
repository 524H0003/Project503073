<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Note extends Model
{
	protected $fillable = ["user_id", "title", "content", "is_pinned", "labels"];

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

	public function labels(): BelongsToMany
	{
		return $this->belongsToMany(Label::class);
	}

	public function setLabels(Note $note, Request $request)
	{
		// Lọc danh sách ID gửi lên, chỉ giữ lại những ID thực sự thuộc về user này
		$validLabelIds = auth()
			->user()
			->labels()
			->whereIn("id", $request->label_ids)
			->pluck("id");

		$note->labels()->sync($validLabelIds);
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
