import { Label, Note, User } from "@/types/model";

export interface IPage {
	auth: {
		user: User;
	};
	notes: Note[];
	[key: string]: any;
	filters: {
		search: string;
		labels: Label[];
	};
	labels: Label[];
}
