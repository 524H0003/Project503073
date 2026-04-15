import { Note, User } from "@/types/model";

export interface IPage {
	auth: {
		user: User;
	};
	notes: Note[];
	[key: string]: any;
}
