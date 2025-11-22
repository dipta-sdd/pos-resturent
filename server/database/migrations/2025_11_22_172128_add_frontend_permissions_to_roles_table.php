<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            // Shop & Organization Permissions
            $table->boolean('can_manage_shop_settings')->default(false)->after('slug');
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
            // Financial & Reports Permissions (keep existing can_manage_expenses, can_view_reports, can_view_dashboard if they exist)
            if (!Schema::hasColumn('roles', 'can_manage_expenses')) {
                $table->boolean('can_manage_expenses')->default(false);
            }
            $table->boolean('can_view_profit_loss_data')->default(false);
            $table->boolean('can_export_data')->default(false);
            // New granular permissions
            if (!Schema::hasColumn('roles', 'can_manage_reservations')) {
                $table->boolean('can_manage_reservations')->default(false);
            }
            $table->boolean('can_manage_payouts')->default(false);
            $table->boolean('can_send_communications')->default(false);
            $table->boolean('can_view_rider_profile')->default(false);
            if (!Schema::hasColumn('roles', 'can_manage_promotions')) {
                $table->boolean('can_manage_promotions')->default(false);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn([
                'can_manage_shop_settings',
                'can_manage_payment_methods',
                'can_manage_staff',
                'can_manage_roles_and_permissions',
                'can_view_user_activity_log',
                'can_view_products',
                'can_manage_products',
                'can_manage_categories',
                'can_import_products',
                'can_export_products',
                'can_use_pos',
                'can_view_sales_history',
                'can_view_customers',
                'can_manage_customers',
                'can_view_profit_loss_data',
                'can_export_data',
                'can_manage_payouts',
                'can_send_communications',
                'can_view_rider_profile',
            ]);
        });
    }
};
