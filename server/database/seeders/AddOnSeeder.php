<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AddOn;

class AddOnSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $addOns = [
            // Cheese options
            ['name' => 'Extra Cheese', 'price' => 1.50],
            ['name' => 'Mozzarella Cheese', 'price' => 1.75],
            ['name' => 'Cheddar Cheese', 'price' => 1.75],
            ['name' => 'Blue Cheese', 'price' => 2.00],
            ['name' => 'Parmesan Cheese', 'price' => 2.00],
            
            // Meat options
            ['name' => 'Bacon', 'price' => 2.50],
            ['name' => 'Extra Bacon', 'price' => 3.00],
            ['name' => 'Grilled Chicken', 'price' => 3.50],
            ['name' => 'Pepperoni', 'price' => 2.00],
            ['name' => 'Sausage', 'price' => 2.50],
            ['name' => 'Ham', 'price' => 2.00],
            
            // Vegetables
            ['name' => 'Avocado', 'price' => 2.50],
            ['name' => 'Mushrooms', 'price' => 1.50],
            ['name' => 'Onions', 'price' => 0.75],
            ['name' => 'Tomatoes', 'price' => 1.00],
            ['name' => 'Lettuce', 'price' => 0.75],
            ['name' => 'Jalapeños', 'price' => 1.00],
            ['name' => 'Olives', 'price' => 1.25],
            ['name' => 'Bell Peppers', 'price' => 1.25],
            ['name' => 'Pickles', 'price' => 0.50],
            
            // Sauces
            ['name' => 'Extra Sauce', 'price' => 0.50],
            ['name' => 'BBQ Sauce', 'price' => 0.75],
            ['name' => 'Ranch Dressing', 'price' => 0.75],
            ['name' => 'Hot Sauce', 'price' => 0.50],
            ['name' => 'Garlic Aioli', 'price' => 1.00],
            ['name' => 'Pesto Sauce', 'price' => 1.25],
            
            // Other toppings
            ['name' => 'Fried Egg', 'price' => 1.50],
            ['name' => 'Guacamole', 'price' => 2.00],
            ['name' => 'Coleslaw', 'price' => 1.50],
            ['name' => 'French Fries Side', 'price' => 3.00],
            ['name' => 'Onion Rings', 'price' => 3.50],
            
            // Drink add-ons
            ['name' => 'Extra Shot (Coffee)', 'price' => 1.00],
            ['name' => 'Whipped Cream', 'price' => 0.75],
            ['name' => 'Flavor Syrup', 'price' => 0.75],
            ['name' => 'Almond Milk', 'price' => 0.75],
            ['name' => 'Oat Milk', 'price' => 0.75],
        ];

        foreach ($addOns as $addOnData) {
            AddOn::updateOrCreate(
                ['name' => $addOnData['name']],
                $addOnData
            );
        }
    }
}
