const CACHE_NAME = "laravel-inertia-cache-v1";

// Chỉ cần cache cứng route gốc để ứng dụng tải được bộ khung ban đầu
const urlsToCache = ["/", "/resources/css/app.css", "/resources/js/app.tsx"];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(urlsToCache);
		}),
	);
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cache) => {
					if (cache !== CACHE_NAME) {
						return caches.delete(cache);
					}
				}),
			);
		}),
	);
});

// XỬ LÝ CHÍNH CHO INERTIA REACT
self.addEventListener("fetch", (event) => {
	if (event.request.method === "GET") {
		// Chỉ xử lý các request thuộc cùng domain
		if (!event.request.url.startsWith(self.location.origin)) {
			return;
		}

		event.respondWith(
			fetch(event.request)
				.then((response) => {
					// Nếu mạng tốt, lưu phản hồi vào cache (áp dụng cho cả file tĩnh, ảnh, HTML gốc và cả JSON của Inertia)
					if (response && response.status === 200) {
						const resClone = response.clone();
						caches.open(CACHE_NAME).then((cache) => {
							cache.put(event.request, resClone);
						});
					}
					return response;
				})
				.catch(() => {
					// KHI MẤT MẠNG: Kiểm tra xem URL này từng được cache chưa
					return caches.match(event.request).then((cachedResponse) => {
						if (cachedResponse) {
							return cachedResponse;
						}

						// Nếu CHƯA TỪNG ĐƯỢC CACHE và là một request chuyển trang của Inertia (trả về JSON)
						if (event.request.headers.get("x-inertia")) {
							return new Response(
								JSON.stringify({
									component: "Errors/Offline", // Tên Component React hiển thị khi offline
									props: { errors: "Không có kết nối mạng." },
									url: event.request.url,
								}),
								{
									status: 200,
									headers: {
										"Content-Type": "application/json",
										"X-Inertia": "true",
									},
								},
							);
						}

						// Nếu là một lượt load lại trang (F5) hoặc truy cập trực tiếp bằng URL từ thanh địa chỉ
						if (event.request.headers.get("accept").includes("text/html")) {
							// Trả về trang chủ '/' (Nơi chứa bộ khung SPA React đã được cache ở install)
							return caches.match("/");
						}
					});
				}),
		);
	}
});
