<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique();
            $table->string('slug', 50)->unique();
            $table->boolean('can_access_dashboard')->default(false);
            $table->boolean('can_manage_users')->default(false);
            $table->boolean('can_manage_menu')->default(false);
            $table->boolean('can_manage_settings')->default(false);
            $table->boolean('can_create_orders')->default(false);
            $table->boolean('can_view_all_orders')->default(false);
            $table->boolean('can_edit_orders')->default(false);
            $table->boolean('can_update_order_status')->default(false);
            $table->boolean('can_manage_finance')->default(false);
            $table->boolean('can_view_reports')->default(false);
            $table->boolean('can_perform_delivery')->default(false);
            $table->boolean('can_perform_shifts')->default(false);
            $table->boolean('is_immutable')->default(false);
            $table->timestamps();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
