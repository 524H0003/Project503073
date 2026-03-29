<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens; // <--- Quan trọng
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;
    
    // ... các field fillable khác
}