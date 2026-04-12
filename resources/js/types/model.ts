export type Note = {
	id: number;
	user_id: number;
	title: string;
	content: string;
	created_at?: string;
	updated_at?: string;
	user?: User;
};
export type User = {
	id: number;
	name: string;
	email: string;
	created_at?: string;
	updated_at?: string;
	notes?: Note[];
};
