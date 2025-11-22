<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $adminRole;
    protected $customerRole;

    protected function setUp(): void
    {
        parent::setUp();

        // Create admin role
        $this->adminRole = Role::create([
            'name' => 'admin',
            'slug' => 'admin',
            'can_manage_users' => true,
        ]);

        // Create customer role
        $this->customerRole = Role::create([
            'name' => 'customer',
            'slug' => 'customer',
        ]);

        // Create admin user
        $this->admin = User::factory()->create([
            'role_id' => $this->adminRole->id,
            'password' => bcrypt('password123'),
        ]);
    }

    public function test_admin_can_list_users()
    {
        User::factory()->count(3)->create(['role_id' => $this->customerRole->id]);

        $token = JWTAuth::fromUser($this->admin);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/system/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'first_name', 'last_name', 'email', 'role_id']
                ]
            ]);
    }

    public function test_admin_can_create_user()
    {
        $token = JWTAuth::fromUser($this->admin);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/system/users', [
            'first_name' => 'New',
            'last_name' => 'User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role_id' => $this->customerRole->id,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'first_name' => 'New',
                'last_name' => 'User',
                'email' => 'newuser@example.com',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
        ]);
    }

    public function test_admin_can_show_user()
    {
        $user = User::factory()->create(['role_id' => $this->customerRole->id]);
        $token = JWTAuth::fromUser($this->admin);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/system/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $user->id,
                'email' => $user->email,
            ]);
    }

    public function test_admin_can_update_user()
    {
        $user = User::factory()->create(['role_id' => $this->customerRole->id]);
        $token = JWTAuth::fromUser($this->admin);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/system/users/{$user->id}", [
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'email' => $user->email,
            'role_id' => $this->customerRole->id,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'first_name' => 'Updated',
                'last_name' => 'Name',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'first_name' => 'Updated',
        ]);
    }

    public function test_admin_can_delete_user()
    {
        $user = User::factory()->create(['role_id' => $this->customerRole->id]);
        $token = JWTAuth::fromUser($this->admin);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/system/users/{$user->id}");

        $response->assertStatus(200); // Or 204

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }

    public function test_non_admin_cannot_manage_users()
    {
        $user = User::factory()->create(['role_id' => $this->customerRole->id]);
        $token = JWTAuth::fromUser($user);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/system/users');

        $response->assertStatus(403);
    }
}
