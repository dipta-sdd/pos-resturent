<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Public\SettingsController as PublicSettingsController;
use App\Http\Controllers\Public\CategoryController as PublicCategoryController;
use App\Http\Controllers\Public\MenuItemController as PublicMenuItemController;
use App\Http\Controllers\Public\PaymentMethodController as PublicPaymentMethodController;
use App\Http\Controllers\Customer\AddressController as CustomerAddressController;
use App\Http\Controllers\Customer\CartController as CustomerCartController;
use App\Http\Controllers\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Customer\ReservationController as CustomerReservationController;
use App\Http\Controllers\Staff\ShiftController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Menu\CategoryController;
use App\Http\Controllers\Menu\MenuItemController;
use App\Http\Controllers\Menu\ItemVariantController;
use App\Http\Controllers\Menu\AddOnController;
use App\Http\Controllers\Finance\FinanceController;
use App\Http\Controllers\Finance\ExpenseController;
use App\Http\Controllers\Finance\ExpenseCategoryController;
use App\Http\Controllers\Finance\PaymentMethodController;
use App\Http\Controllers\Finance\RiderLedgerController;
use App\Http\Controllers\Finance\PayoutController;
use App\Http\Controllers\Rider\RiderController;
use App\Http\Controllers\System\UserController;
use App\Http\Controllers\System\RoleController;
use App\Http\Controllers\System\SettingsController;
use App\Http\Controllers\System\TableController;
use App\Http\Controllers\System\ReportController;
use App\Http\Controllers\System\CouponController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['log.api'])->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
        Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
        Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('reset-password', [AuthController::class, 'resetPassword']);
        Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');
        Route::put('profile', [AuthController::class, 'updateProfile'])->middleware('auth:api');
    });

    Route::post('/media/upload', [MediaController::class, 'upload'])->middleware('auth:api');
    Route::get('/notifications', [NotificationController::class, 'index'])->middleware('auth:api');
    Route::patch('/notifications/read', [NotificationController::class, 'markAsRead'])->middleware('auth:api');

    Route::prefix('public')->group(function () {
        Route::get('settings', [PublicSettingsController::class, 'index']);
        Route::get('categories', [PublicCategoryController::class, 'index']);
        Route::get('menu-items', [PublicMenuItemController::class, 'index']);
        Route::get('menu-items/{slug}', [PublicMenuItemController::class, 'show']);
        Route::get('payment-methods', [PublicPaymentMethodController::class, 'index']);
    });

    Route::prefix('customer')->middleware(['auth:api', 'role:customer'])->group(function () {
        Route::apiResource('addresses', CustomerAddressController::class);
        Route::post('cart/validate', [CustomerCartController::class, 'validateCart']);
        Route::get('orders', [CustomerOrderController::class, 'index']);
        Route::post('orders', [CustomerOrderController::class, 'store']);
        Route::get('orders/{id}', [CustomerOrderController::class, 'show']);
        Route::post('orders/{id}/cancel', [CustomerOrderController::class, 'cancel']);
        Route::apiResource('reservations', CustomerReservationController::class)->only(['index', 'store']);
    });

    Route::prefix('shifts')->middleware(['auth:api', 'permission:can_perform_shifts'])->group(function () {
        Route::post('start', [ShiftController::class, 'start']);
        Route::get('current', [ShiftController::class, 'current']);
        Route::post('end', [ShiftController::class, 'end']);
        Route::get('{id}/report', [ShiftController::class, 'report']);
    });

    Route::middleware('auth:api')->group(function () {
        Route::get('orders', [OrderController::class, 'index'])->middleware('permission:can_view_all_orders');
        Route::post('orders', [OrderController::class, 'store'])->middleware('permission:can_create_orders');
        Route::get('orders/{id}', [OrderController::class, 'show'])->middleware('permission:can_view_all_orders');
        Route::put('orders/{id}', [OrderController::class, 'update'])->middleware('permission:can_edit_orders');
        Route::patch('orders/{id}/status', [OrderController::class, 'updateStatus'])->middleware('permission:can_update_order_status');
        Route::patch('orders/{id}/assign', [OrderController::class, 'assign'])->middleware('permission:can_edit_orders');
        Route::post('orders/{id}/payments', [OrderController::class, 'addPayment'])->middleware('permission:can_create_orders');
        Route::delete('orders/{id}/payments/{paymentId}', [OrderController::class, 'refundPayment'])->middleware('permission:can_edit_orders');
        Route::get('orders/{id}/print', [OrderController::class, 'printReceipt'])->middleware('permission:can_create_orders');

        Route::prefix('menu')->middleware('permission:can_manage_menu')->group(function () {
            Route::apiResource('categories', CategoryController::class);
            Route::apiResource('menu-items', MenuItemController::class);
            Route::patch('menu-items/{id}/status', [MenuItemController::class, 'updateStatus']);
            Route::apiResource('menu-items/{menu_item_id}/variants', ItemVariantController::class);
            Route::apiResource('add-ons', AddOnController::class);
        });

        Route::prefix('finance')->middleware('permission:can_manage_finance')->group(function () {
            Route::get('stats', [FinanceController::class, 'stats']);
            Route::apiResource('expenses', ExpenseController::class);
            Route::apiResource('expense-categories', ExpenseCategoryController::class);
            Route::get('payment-methods', [PaymentMethodController::class, 'index']);
            Route::get('rider-ledgers', [RiderLedgerController::class, 'index']);
            Route::patch('payouts/{id}', [PayoutController::class, 'update']);
        });

        Route::prefix('rider')->middleware('permission:can_perform_delivery')->group(function () {
            Route::get('dashboard', [RiderController::class, 'dashboard']);
            Route::patch('delivery/status', [RiderController::class, 'updateStatus']);
            Route::post('delivery/location', [RiderController::class, 'updateLocation']);
            Route::get('orders', [RiderController::class, 'orders']);
            Route::post('documents', [RiderController::class, 'uploadDocuments']);
            Route::post('/finance/payouts', [PayoutController::class, 'store']);
        });

        Route::prefix('system')->group(function () {
            Route::apiResource('users', UserController::class)->middleware('permission:can_manage_users');
            Route::apiResource('roles', RoleController::class)->middleware('permission:can_manage_users');
            Route::get('settings', [SettingsController::class, 'index'])->middleware('permission:can_manage_settings');
            Route::put('settings', [SettingsController::class, 'update'])->middleware('permission:can_manage_settings');
            Route::apiResource('tables', TableController::class)->middleware('permission:can_manage_settings');
            Route::get('reports/export', [ReportController::class, 'export'])->middleware('permission:can_view_reports');
            Route::apiResource('coupons', CouponController::class)->middleware('permission:can_manage_settings');
        });
    });
});