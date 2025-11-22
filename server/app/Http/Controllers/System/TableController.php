<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\StoreTableRequest;
use App\Http\Requests\System\UpdateTableRequest;
use App\Models\DiningTable;
use Illuminate\Support\Facades\Auth;

class TableController extends Controller
{
    public function index()
    {
        return DiningTable::paginate();
    }

    public function store(StoreTableRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        $table = DiningTable::create($data);
        return response()->json($table, 201);
    }

    public function show(DiningTable $table)
    {
        $this->authorize('view', $table);
        return $table;
    }

    public function update(UpdateTableRequest $request, DiningTable $table)
    {
        $this->authorize('update', $table);
        $data = $request->validated();
        $data['updated_by'] = Auth::id();
        $table->update($data);
        return response()->json($table);
    }

    public function destroy(DiningTable $table)
    {
        $this->authorize('delete', $table);
        $table->delete();
        return response()->json(null, 204);
    }
}
