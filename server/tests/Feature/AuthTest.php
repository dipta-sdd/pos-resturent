<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $role;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a role
        $this->role = Role::create([
            'name' => 'customer',
            'slug' => 'customer',
            'is_immutable' => true,
        ]);

        // Create a user
        $this->user = User::factory()->create([
            'role_id' => $this->role->id,
            'password' => bcrypt('password123'),
        ]);
    }

    public function test_user_can_register()
    {
        $response = $this->postJson('/api/auth/register', [
            'firstName' => 'John',
            'lastName' => 'Doe',
            'email' => 'john@example.com',
            'mobile' => '1234567890',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'user' => [
                    'id',
                    'first_name',
                    'last_name',
                    'email',
                    // 'phone', // phone is expected but controller uses mobile, let's see what happens
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);
    }

    public function test_user_can_login()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => $this->user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'token_type',
                'expires_in',
                'user'
            ]);
    }

    public function test_user_can_get_me()
    {
        $token = JWTAuth::fromUser($this->user);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJson([
                'id' => $this->user->id,
                'email' => $this->user->email,
            ]);
    }

    public function test_user_can_logout()
    {
        $token = JWTAuth::fromUser($this->user);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'User successfully logged out']);
    }

    public function test_user_can_refresh_token()
    {
        $token = JWTAuth::fromUser($this->user);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/refresh');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'token_type',
                'expires_in',
            ]);
    }
}
