<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Appetizers',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Burgers & Sandwiches',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Pizza',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Pasta',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Main Courses',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Salads',
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'Desserts',
                'sort_order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Beverages',
                'sort_order' => 8,
                'is_active' => true,
                'parent_id' => null,
            ],
        ];

        // Insert parent categories first
        foreach ($categories as $categoryData) {
            Category::updateOrCreate(
                ['name' => $categoryData['name']],
                $categoryData
            );
        }

        // Add sub-categories for Beverages
        $beveragesCategory = Category::where('name', 'Beverages')->first();
        if ($beveragesCategory) {
            $subCategories = [
                [
                    'parent_id' => $beveragesCategory->id,
                    'name' => 'Hot Drinks',
                    'sort_order' => 1,
                    'is_active' => true,
                ],
                [
                    'parent_id' => $beveragesCategory->id,
                    'name' => 'Cold Drinks',
                    'sort_order' => 2,
                    'is_active' => true,
                ],
                [
                    'parent_id' => $beveragesCategory->id,
                    'name' => 'Smoothies & Shakes',
                    'sort_order' => 3,
                    'is_active' => true,
                ],
            ];

            foreach ($subCategories as $subCategoryData) {
                Category::updateOrCreate(
                    [
                        'name' => $subCategoryData['name'],
                        'parent_id' => $subCategoryData['parent_id']
                    ],
                    $subCategoryData
                );
            }
        }
    }
}
