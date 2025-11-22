<?php

namespace App\Http\Controllers\Menu;

use App\Http\Controllers\Controller;
use App\Models\AddOn;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AddOnController extends Controller
{
    /**
     * Display a listing of add-ons.
     */
    public function index()
    {
        $addOns = AddOn::paginate(10);
        return response()->json($addOns);
    }

    /**
     * Store a newly created add-on.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:add_ons',
            'price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $addOn = AddOn::create($request->all());

        return response()->json($addOn, 201);
    }

    /**
     * Display the specified add-on.
     */
    public function show($id)
    {
        $addOn = AddOn::find($id);

        if (!$addOn) {
            return response()->json(['message' => 'Add-on not found'], 404);
        }

        return response()->json($addOn);
    }

    /**
     * Update the specified add-on.
     */
    public function update(Request $request, $id)
    {
        $addOn = AddOn::find($id);

        if (!$addOn) {
            return response()->json(['message' => 'Add-on not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:add_ons,name,' . $id,
            'price' => 'sometimes|required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $addOn->update($request->all());

        return response()->json($addOn);
    }

    /**
     * Remove the specified add-on.
     */
    public function destroy($id)
    {
        $addOn = AddOn::find($id);

        if (!$addOn) {
            return response()->json(['message' => 'Add-on not found'], 404);
        }

        $addOn->delete();

        return response()->json(['message' => 'Add-on deleted successfully']);
    }
}
