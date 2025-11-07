<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'item_variant_id',
        'quantity',
        'unit_price',
        'customization_notes',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function itemVariant()
    {
        return $this->belongsTo(ItemVariant::class);
    }

    public function addOns()
    {
        return $this->belongsToMany(AddOn::class, 'order_item_add_ons')->withPivot('quantity', 'price');
    }
}
