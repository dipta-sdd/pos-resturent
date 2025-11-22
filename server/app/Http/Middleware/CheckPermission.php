<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        if (!$user || !$user->role) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if the role has the specific permission column set to true
        // We assume the permission argument matches the column name in roles table
        if (!$user->role->{$permission}) {
            return response()->json(['message' => 'Forbidden', 'user' => $user], 403);
        }

        return $next($request);
    }
}
