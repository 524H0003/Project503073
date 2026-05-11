<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
	use HasApiTokens, Notifiable;

	protected $fillable = ["name", "email", "password", "labels"];

	protected $hidden = ["password", "remember_token"];

	protected $casts = [
		"password" => "hashed",
	];

	public function notes(): HasMany
	{
		return $this->hasMany(Note::class);
	}

	public function labels(): HasMany
	{
		return $this->hasMany(Label::class);
	}
}
