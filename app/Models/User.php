<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail; 
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        "name", 
        "email", 
        "password", 
        "avatar", 
        "preferences"
    ];

    protected $hidden = [
        "password", 
        "remember_token"
    ];

    protected $casts = [
        "email_verified_at" => "datetime", 
        "password" => "hashed",
        "preferences" => "json", 
    ];

    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }
}