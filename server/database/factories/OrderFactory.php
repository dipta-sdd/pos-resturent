<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_number' => 'ORD-' . strtoupper(Str::random(10)),
            'user_id' => User::factory(),
            'status' => 'pending',
            'order_type' => fake()->randomElement(['delivery', 'dine_in', 'takeaway']),
            'subtotal' => fake()->randomFloat(2, 10, 100),
            'total_amount' => fake()->randomFloat(2, 10, 100),
            'payment_status' => 'unpaid',
        ];
    }
}
