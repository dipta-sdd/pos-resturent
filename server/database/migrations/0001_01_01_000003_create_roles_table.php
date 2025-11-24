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
            // new pers
            // Shop & Organization Permissions
            $table->boolean('can_manage_shop_settings')->default(false);
            $table->boolean('can_manage_payment_methods')->default(false);
            // User Management Permissions
            $table->boolean('can_manage_staff')->default(false);
            $table->boolean('can_manage_roles_and_permissions')->default(false);
            $table->boolean('can_view_user_activity_log')->default(false);
            // Product & Catalog Permissions
            $table->boolean('can_view_products')->default(false);
            $table->boolean('can_manage_products')->default(false);
            $table->boolean('can_manage_categories')->default(false);
            $table->boolean('can_import_products')->default(false);
            $table->boolean('can_export_products')->default(false);
            // Sales & POS Permissions
            $table->boolean('can_use_pos')->default(false);
            $table->boolean('can_view_sales_history')->default(false);
            // Customer Management Permissions
            $table->boolean('can_view_customers')->default(false);
            $table->boolean('can_manage_customers')->default(false);
            $table->boolean('can_manage_expenses')->default(false);
            $table->boolean('can_view_profit_loss_data')->default(false);
            $table->boolean('can_export_data')->default(false);
            // New granular permissions
            $table->boolean('can_manage_reservations')->default(false);
            $table->boolean('can_manage_payouts')->default(false);
            $table->boolean('can_send_communications')->default(false);
            $table->boolean('can_view_rider_profile')->default(false);
            $table->boolean('can_manage_promotions')->default(false);
            // new pers
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
