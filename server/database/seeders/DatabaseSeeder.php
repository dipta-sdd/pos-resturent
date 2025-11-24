<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            CategorySeeder::class,
            AddOnSeeder::class,
            MenuItemSeeder::class,
        ]);

        $adminRole = \App\Models\Role::where('slug', 'admin')->first();
        if ($adminRole) {
            User::factory()->create([
                'first_name' => 'Admin',
                'last_name' => 'User',
                'email' => 'admin@gmail.com',
                'password' => bcrypt('Spider@2580'),
                'role_id' => $adminRole->id,
            ]);
        }

        $customerRole = \App\Models\Role::where('slug', 'customer')->first();
        if ($customerRole) {
            User::factory()->create([
                'first_name' => 'Customer',
                'last_name' => 'User',
                'email' => 'ddas5160@gmail.com',
                'password' => bcrypt('Spider@2580'),
                'role_id' => $customerRole->id,
            ]);
        }
    }
}
