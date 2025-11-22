<?php

namespace App\Http\Controllers\Menu;

use App\Http\Controllers\Controller;
use App\Http\Requests\Menu\StoreAddOnRequest;
use App\Http\Requests\Menu\UpdateAddOnRequest;
use App\Models\AddOn;
use Illuminate\Support\Facades\Auth;

class AddOnController extends Controller
{
    public function index()
    {
        return AddOn::paginate();
    }

    public function store(StoreAddOnRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        $addOn = AddOn::create($data);
        return response()->json($addOn, 201);
    }

    public function show(AddOn $addOn)
    {
        $this->authorize('view', $addOn);
        return $addOn;
    }

    public function update(UpdateAddOnRequest $request, AddOn $addOn)
    {
        $this->authorize('update', $addOn);
        $data = $request->validated();
        $data['updated_by'] = Auth::id();
        $addOn->update($data);
        return response()->json($addOn);
    }

    public function destroy(AddOn $addOn)
    {
        $this->authorize('delete', $addOn);
        $addOn->delete();
        return response()->json(null, 204);
    }
}
