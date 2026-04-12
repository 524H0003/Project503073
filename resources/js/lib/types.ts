import { Note } from "@/types/model";

export interface IUser {
	name: string;
	email: string;
	avatar: string;
}

export interface IPage {
	auth: {
		user: IUser;
	};
	notes: Note[];
	[key: string]: any;
}
