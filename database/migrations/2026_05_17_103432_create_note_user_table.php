<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create("note_user", function (Blueprint $table) {
			$table->id();
			$table->foreignId("note_id")->constrained()->onDelete("cascade");
			$table->foreignId("user_id")->constrained()->onDelete("cascade");
			// Quyền hạn: 'view' (Chỉ đọc) hoặc 'edit' (Sửa đổi)
			$table->string("permission")->default("view");
			$table->timestamps();

			// Đảm bảo một ghi chú không bị lặp lại lượt chia sẻ cho cùng một người
			$table->unique(["note_id", "user_id"]);
		});
	}

	public function down(): void
	{
		Schema::dropIfExists("note_user");
	}
};
