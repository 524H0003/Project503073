<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Label;
use Illuminate\Validation\Rule;

class LabelController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		//
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request)
	{
		$request->merge(["user_id" => auth()->id()]);

		$validated = $request->validate([
			"name" => "required|string|max:50",
			// "color" => "nullable|string|max:7",
		]);

		auth()->user()->labels()->create($validated);

		return back()->with("message", "Đã tạo nhãn thành công!");
	}

	/**
	 * Display the specified resource.
	 */
	public function show(string $id)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(string $id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, Label $label)
	{
		if ($label->user_id !== auth()->id()) {
			abort(403);
		}

		$validated = $request->validate(
			[
				"name" => [
					"required",
					"string",
					"max:50",
					Rule::unique("labels", "name")
						->where("user_id", auth()->id())
						->ignore($label->id),
				],
			],
			[
				"name.unique" => "Bạn đã có một nhãn với tên này rồi!",
			],
		);

		$label->update($validated);

		return back();
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(Label $label)
	{
		if ($label->user_id !== auth()->id()) {
			abort(403);
		}

		$label->delete();

		return back();
	}
}
