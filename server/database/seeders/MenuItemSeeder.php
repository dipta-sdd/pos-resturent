<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        // Get category IDs
        $categories = DB::table('categories')->pluck('id', 'name');

        $menuItems = [
            // Appetizers
            [
                'category_id' => $categories['Appetizers'] ?? 1,
                'name' => 'Spring Rolls',
                'description' => 'Crispy vegetable spring rolls served with sweet chili sauce',
                'image_url' => 'https://images.unsplash.com/photo-1620159503946-78b85e79aec5?w=400',
                'is_active' => true,
                'is_featured' => false,
                'variants' => [
                    ['name' => 'Regular (4 pcs)', 'price' => 5.99, 'is_active' => true],
                    ['name' => 'Large (8 pcs)', 'price' => 9.99, 'is_active' => true],
                ]
            ],
            [
                'category_id' => $categories['Appetizers'] ?? 1,
                'name' => 'Chicken Wings',
                'description' => 'Crispy chicken wings tossed in your choice of sauce',
                'image_url' => 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
                'is_active' => true,
                'is_featured' => true,
                'variants' => [
                    ['name' => '6 pieces', 'price' => 7.99, 'is_active' => true],
                    ['name' => '12 pieces', 'price' => 13.99, 'is_active' => true],
                    ['name' => '24 pieces', 'price' => 24.99, 'is_active' => true],
                ]
            ],
            [
                'category_id' => $categories['Appetizers'] ?? 1,
                'name' => 'Mozzarella Sticks',
                'description' => 'Golden-fried mozzarella sticks with marinara sauce',
                'image_url' => 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400',
                'is_active' => true,
                'is_featured' => false,
                'variants' => [
                    ['name' => 'Regular (6 pcs)', 'price' => 6.99, 'is_active' => true],
                ]
            ],

            // Main Courses
            [
                'category_id' => $categories['Main Courses'] ?? 2,
                'name' => 'Grilled Chicken',
                'description' => 'Juicy grilled chicken breast with herbs and spices',
                'image_url' => 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
                'is_active' => true,
                'is_featured' => true,
                'variants' => [
                    ['name' => 'Single', 'price' => 12.99, 'is_active' => true],
                    ['name' => 'Double', 'price' => 19.99, 'is_active' => true],
                ]
            ],
            [
                'category_id' => $categories['Main Courses'] ?? 2,
                'name' => 'Beef Steak',
                'description' => 'Premium beef steak cooked to perfection',
                'image_url' => 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400',
                'is_active' => true,
                'is_featured' => true,
                'variants' => [
                    ['name' => '8 oz', 'price' => 18.99, 'is_active' => true],
                    ['name' => '12 oz', 'price' => 24.99, 'is_active' => true],
                    ['name' => '16 oz', 'price' => 29.99, 'is_active' => true],
                ]
            ],
            [
                'category_id' => $categories['Main Courses'] ?? 2,
                'name' => 'Salmon Fillet',
                'description' => 'Pan-seared salmon with lemon butter sauce',
                'image_url' => 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400',
                'is_active' => true,
                'is_featured' => false,
                'variants' => [
                    ['name' => 'Regular', 'price' => 16.99, 'is_active' => true],
                ]
            ],

            // Pizzas
            [
                'category_id' => $categories['Pizzas'] ?? 3,
                'name' => 'Margherita Pizza',
                'description' => 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
                'image_url' => 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
                'is_active' => true,
                'is_featured' => true,
                'variants' => [
                    ['name' => 'Small (10")', 'price' => 9.99, 'is_active' => true],
                    ['name' => 'Medium (12")', 'price' => 13.99, 'is_active' => true],
                    ['name' => 'Large (14")', 'price' => 16.99, 'is_active' => true],
                ]
            ],
            [
                'category_id' => $categories['Pizzas'] ?? 3,
                'name' => 'Pepperoni Pizza',
                'description' => 'Loaded with pepperoni and mozzarella cheese',
                'image_url' => 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
                'is_active' => true,
                'is_featured' => true,
                'variants' => [
                    ['name' => 'Small (10")', 'price' => 11.99, 'is_active' => true],
                    ['name' => 'Medium (12")', 'price' => 15.99, 'is_active' => true],
                    ['name' => 'Large (14")', 'price' => 19.99, 'is_active' => true],
                ]
            ],

            // Burgers  
            [
                'category_id' => $categories['Burgers'] ?? 4,
                'name' => 'Classic Burger',
                'description' => 'Beef patty with lettuce, tomato, onion, and special sauce',
                'image_url' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
                'is_active' => true,
                'is_featured' => true,
                'variants' => [
                    ['name' => 'Single', 'price' => 8.99, 'is_active' => true],
                    ['name' => 'Double', 'price' => 12.99, 'is_active' => true],
                ]
            ],
            [
                'category_id' => $categories['Burgers'] ?? 4,
                'name' => 'Cheese Burger',
                'description' => 'Juicy beef patty with melted cheddar cheese',
                'image_url' => 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400',
                'is_active' => true,
                'is_featured' => false,
                'variants' => [
                    ['name' => 'Single', 'price' => 9.99, 'is_active' => true],
                    ['name' => 'Double', 'price' => 13.99, 'is_active' => true],
                ]
            ],

            // Drinks
            [
                'category_id' => $categories['Beverages'] ?? 5,
                'name' => 'Coca Cola',
                'description' => 'Refreshing classic Coke',
                'image_url' => 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
                'is_active' => true,
                'is_featured' => false,
                'variants' => [
                    ['name' => 'Small', 'price' => 1.99, 'is_active' => true],
                    ['name' => 'Medium', 'price' => 2.49, 'is_active' => true],
                    ['name' => 'Large', 'price' => 2.99, 'is_active' => true],
                ]
            ],
            [
                'category_id' => $categories['Beverages'] ?? 5,
                'name' => 'Fresh Orange Juice',
                'description' => 'Freshly squeezed orange juice',
                'image_url' => 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
                'is_active' => true,
                'is_featured' => false,
                'variants' => [
                    ['name' => 'Regular', 'price' => 3.99, 'is_active' => true],
                    ['name' => 'Large', 'price' => 5.99, 'is_active' => true],
                ]
            ],

            // Desserts
            [
                'category_id' => $categories['Desserts'] ?? 6,
                'name' => 'Chocolate Cake',
                'description' => 'Rich chocolate cake with chocolate frosting',
                'image_url' => 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
                'is_active' => true,
                'is_featured' => true,
                'variants' => [
                    ['name' => 'Slice', 'price' => 4.99, 'is_active' => true],
                    ['name' => 'Whole Cake', 'price' => 29.99, 'is_active' => true],
                ]
            ],
            [
                'category_id' => $categories['Desserts'] ?? 6,
                'name' => 'Ice Cream Sundae',
                'description' => 'Vanilla ice cream with toppings and whipped cream',
                'image_url' => 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
                'is_active' => true,
                'is_featured' => false,
                'variants' => [
                    ['name' => 'Regular', 'price' => 3.99, 'is_active' => true],
                    ['name' => 'Large', 'price' => 5.99, 'is_active' => true],
                ]
            ],
        ];

        // ...

        foreach ($menuItems as $itemData) {
            $variants = $itemData['variants'];
            unset($itemData['variants']);

            $itemData['slug'] = Str::slug($itemData['name']);
            $itemData['created_at'] = $now;
            $itemData['updated_at'] = $now;

            $menuItemId = DB::table('menu_items')->insertGetId($itemData);

            // Insert variants
            foreach ($variants as $variant) {
                DB::table('item_variants')->insert([
                    'menu_item_id' => $menuItemId,
                    'name' => $variant['name'],
                    'price' => $variant['price'],
                    'is_active' => $variant['is_active'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }
}

