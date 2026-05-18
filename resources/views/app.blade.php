<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name') }}</title>
    @viteReactRefresh
    @vite(['resources/js/app.tsx', 'resources/css/app.css'])
    @inertiaHead
    @routes
</head>

<body>
    @inertia

    <link rel="manifest" href="/manifest.json">

    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('Service Worker đã sẵn sàng: ', reg.scope))
                    .catch(err => console.log('Lỗi đăng ký Service Worker: ', err));
            });
        }
    </script>
</body>

</html>