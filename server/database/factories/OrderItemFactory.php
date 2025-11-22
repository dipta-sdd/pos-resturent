<?php

namespace Database\Factories;

use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'menu_item_id' => MenuItem::factory(),
            'item_name' => fake()->word(),
            'unit_price' => fake()->randomFloat(2, 5, 20),
            'quantity' => fake()->numberBetween(1, 5),
            'total_price' => fake()->randomFloat(2, 5, 100),
        ];
    }
}
