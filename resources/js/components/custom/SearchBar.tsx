import { IPage } from "@/lib/types";
import { router, usePage } from "@inertiajs/react";
import { Input } from "../ui/input";
import { ChangeEvent, useCallback, useState } from "react";
import { debounce } from "lodash";

export function SearchBar({ className = "" }) {
	const { filters } = usePage<IPage>().props;

	const [search, setSearch] = useState(filters?.search || "");

	const handleSearch = useCallback(
		debounce((value) => {
			router.get(
				window.location.href,
				{ search: value },
				{
					preserveState: true,
					preserveScroll: true,
					only: ["notes"],
				},
			);
		}, 300),
		[],
	);

	const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearch(value);
		handleSearch(value);
	};

	return (
		<Input
			className={className}
			type="text"
			placeholder="Tìm kiếm ghi chú..."
			value={search}
			onChange={onSearchChange}
		/>
	);
}
