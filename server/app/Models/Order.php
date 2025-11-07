<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'order_type',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'delivery_charge',
        'total_amount',
        'special_instructions',
        'delivery_address_id',
        'table_id',
        'rider_id',
        'staff_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function deliveryAddress()
    {
        return $this->belongsTo(Address::class, 'delivery_address_id');
    }

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function rider()
    {
        return $this->belongsTo(User::class, 'rider_id');
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function payments()
    {
        return $this->hasMany(OrderPayment::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
