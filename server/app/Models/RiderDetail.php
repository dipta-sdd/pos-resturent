<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiderDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'user_id',
        'vehicle_type',
        'license_plate',
        'id_document_url',
        'license_document_url',
        'is_verified',
        'availability_status',
        'current_latitude',
        'current_longitude',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
