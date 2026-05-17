<?php

namespace App\Http\Middleware;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
	/**
	 * The root template that's loaded on the first page visit.
	 *
	 * @see https://inertiajs.com/server-side-setup#root-template
	 *
	 * @var string
	 */
	protected $rootView = "app";

	/**
	 * Determines the current asset version.
	 *
	 * @see https://inertiajs.com/asset-versioning
	 */
	public function version(Request $request): ?string
	{
		return parent::version($request);
	}

	/**
	 * Define the props that are shared by default.
	 *
	 * @see https://inertiajs.com/shared-data
	 *
	 * @return array<string, mixed>
	 */
	public function share(Request $request): array
	{
		$user = $request->user();

		return [
			...parent::share($request),
			"auth" => [
				"user" => $user
					? [
						"id" => $user->id,
						"name" => $user->name,
						"email" => $user->email,
						"avatar" => $user->avatar,
						"email_verified_at" => $user->email_verified_at,
						"preferences" => $user->preferences ?? [
							"theme" => "light",
							"font_size" => "medium",
						],
					]
					: null,
			],
			"notes" => $request->user()
				? $request
					->user()
					->notes()
					->ordered()
					->search($request->input("search"))
					->filterByLabels($request->input("labels"))
					->with("labels")
					->get()
					->map(
						fn($note) => [
							"id" => $note->id,
							"title" => $note->title,
							"content" => Str::limit(strip_tags($note->content), 32),
							"updated_at" => $note->updated_at,
							"pinned_at" => $note->pinned_at,
							"labels" => $note->labels,
						],
					)
				: [],
			"filters" => $request->only(["search", "labels"]),
			"labels" => fn() => $request->user()
				? $request->user()->labels()->select("labels.id", "labels.name")->get()
				: [],
			"status" => session("status"),
		];
	}
}
