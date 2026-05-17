<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
	->withRouting(
        channels: __DIR__.'/../routes/channels.php',web: __DIR__ . "/../routes/web.php", health: "/up")
	->withMiddleware(function (Middleware $middleware): void {
		$middleware->statefulApi();

		$middleware->redirectGuestsTo("/");

		$middleware->web(
			append: [
				\App\Http\Middleware\HandleInertiaRequests::class,
				\App\Http\Middleware\TrustProxies::class,
				\Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
			],
		);
	})
	->withExceptions(function (Exceptions $exceptions): void {
		//
	})
	->create();
