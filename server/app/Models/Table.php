<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_or_number',
        'capacity',
        'status',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
