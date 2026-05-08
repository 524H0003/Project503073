<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::create("labels", function (Blueprint $table) {
			$table->id();
			// Ràng buộc user_id để đảm bảo nhãn thuộc về riêng từng người
			$table->foreignId("user_id")->constrained()->cascadeOnDelete();
			$table->string("name");
			$table->timestamps();

			// Đảm bảo một người dùng không tạo 2 nhãn trùng tên
			$table->unique(["user_id", "name"]);
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists("labels");
	}
};
