<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use App\Models\Order;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    protected $staff;
    protected $staffRole;
    protected $customerRole;

    protected function setUp(): void
    {
        parent::setUp();

        // Create staff role
        $this->staffRole = Role::create([
            'name' => 'staff',
            'slug' => 'staff',
            'can_view_all_orders' => true,
            'can_create_orders' => true,
            'can_edit_orders' => true,
            'can_update_order_status' => true,
        ]);

        // Create customer role
        $this->customerRole = Role::create([
            'name' => 'customer',
            'slug' => 'customer',
        ]);

        // Create staff user
        $this->staff = User::factory()->create([
            'role_id' => $this->staffRole->id,
            'password' => bcrypt('password123'),
        ]);
    }

    public function test_staff_can_list_orders()
    {
        Order::factory()->count(3)->create(['user_id' => $this->staff->id]);

        $token = JWTAuth::fromUser($this->staff);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/orders');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'order_number', 'status', 'total_amount']
                ]
            ]);
    }

    public function test_staff_can_create_order()
    {
        $menuItem = MenuItem::factory()->create();
        $variant = \App\Models\ItemVariant::factory()->create(['menu_item_id' => $menuItem->id]);
        $token = JWTAuth::fromUser($this->staff);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/orders', [
            'order_type' => 'dine_in',
            'items' => [
                [
                    'menu_item_id' => $menuItem->id,
                    'item_variant_id' => $variant->id,
                    'quantity' => 2,
                    'unit_price' => 10.00,
                    'item_name' => $menuItem->name,
                    'variant_name' => $variant->name,
                ]
            ]
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'order_type' => 'dine_in',
                'status' => 'pending',
            ]);

        $this->assertDatabaseHas('orders', [
            'order_type' => 'dine_in',
            'total_amount' => 20.00,
        ]);
    }

    public function test_staff_can_show_order()
    {
        $order = Order::factory()->create(['user_id' => $this->staff->id]);
        $token = JWTAuth::fromUser($this->staff);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/orders/{$order->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $order->id,
                'order_number' => $order->order_number,
            ]);
    }

    public function test_staff_can_update_order()
    {
        $order = Order::factory()->create(['user_id' => $this->staff->id]);
        $token = JWTAuth::fromUser($this->staff);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/orders/{$order->id}", [
            'special_instructions' => 'No onions',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'special_instructions' => 'No onions',
            ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'special_instructions' => 'No onions',
        ]);
    }

    public function test_staff_can_update_order_status()
    {
        $order = Order::factory()->create(['user_id' => $this->staff->id, 'status' => 'pending']);
        $token = JWTAuth::fromUser($this->staff);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->patchJson("/api/orders/{$order->id}/status", [
            'status' => 'preparing',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'preparing',
            ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'preparing',
        ]);
    }
}
