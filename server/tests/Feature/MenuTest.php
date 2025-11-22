<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class MenuTest extends TestCase
{
    use RefreshDatabase;

    protected $manager;
    protected $managerRole;
    protected $customerRole;

    protected function setUp(): void
    {
        parent::setUp();

        // Create manager role
        $this->managerRole = Role::create([
            'name' => 'manager',
            'slug' => 'manager',
            'can_manage_menu' => true,
        ]);

        // Create customer role
        $this->customerRole = Role::create([
            'name' => 'customer',
            'slug' => 'customer',
        ]);

        // Create manager user
        $this->manager = User::factory()->create([
            'role_id' => $this->managerRole->id,
            'password' => bcrypt('password123'),
        ]);
    }

    public function test_manager_can_list_categories()
    {
        Category::factory()->count(3)->create();

        $token = JWTAuth::fromUser($this->manager);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/menu/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'image_url', 'is_active']
                ]
            ]);
    }

    public function test_manager_can_create_category()
    {
        $token = JWTAuth::fromUser($this->manager);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/menu/categories', [
            'name' => 'New Category',
            'is_active' => true,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'name' => 'New Category',
            ]);

        $this->assertDatabaseHas('categories', [
            'name' => 'New Category',
        ]);
    }

    public function test_manager_can_update_category()
    {
        $category = Category::factory()->create();
        $token = JWTAuth::fromUser($this->manager);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/menu/categories/{$category->id}", [
            'name' => 'Updated Category',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Updated Category',
            ]);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Category',
        ]);
    }

    public function test_manager_can_delete_category()
    {
        $category = Category::factory()->create();
        $token = JWTAuth::fromUser($this->manager);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/menu/categories/{$category->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('categories', [
            'id' => $category->id,
        ]);
    }

    public function test_manager_can_create_menu_item()
    {
        $category = Category::factory()->create();
        $token = JWTAuth::fromUser($this->manager);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/menu/menu-items', [
            'category_id' => $category->id,
            'name' => 'New Item',
            'description' => 'Delicious item',
            'is_active' => true,
            'is_veg' => true,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'name' => 'New Item',
                'category_id' => $category->id,
            ]);

        $this->assertDatabaseHas('menu_items', [
            'name' => 'New Item',
            'slug' => 'new-item',
        ]);
    }

    public function test_manager_can_update_menu_item_status()
    {
        $category = Category::factory()->create();
        $menuItem = MenuItem::factory()->create(['category_id' => $category->id, 'is_active' => false]);
        $token = JWTAuth::fromUser($this->manager);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->patchJson("/api/menu/menu-items/{$menuItem->id}/status", [
            'is_active' => true,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'is_active' => true,
            ]);

        $this->assertDatabaseHas('menu_items', [
            'id' => $menuItem->id,
            'is_active' => true,
        ]);
    }
}
