export interface IUser {
	name: string;
	email: string;
	avatar: string;
}

export interface IPage {
	auth: {
		user: IUser;
	};
	[key: string]: any;
}
