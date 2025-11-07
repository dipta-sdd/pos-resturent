<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'amount',
        'status',
        'payout_method',
        'transaction_details',
        'requested_at',
        'completed_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
