export class Theme {
	bg: string;
	'light-bg': string;
	fg: string;
	text?: string;
	'light-text': string;
	'sender-text': string;
	checked: string;
	'save-bg': string;

	'icon-message': string;
	'icon-new': string;
	'icon-reaction': string;
	'icon-favorite': string;
	'confirm': string;
}

export class GroupDTO {
	id: string;
	name: string | null;
	new_activity: boolean;
	picture: string;
	message_count: number;
	is_private: boolean;
}

export class UserDTO {
	username: string;
	display_name: string;
	profile_pic: string;
	bio: string;
}

export class InviteDTO {
	id: string;
	sent_by: UserDTO;
	group: GroupDTO;
	sent_at: string;
}

export class ItemDTO {
	name: string;
	type: string;
	id: string;
	artist: string;
	image: string;
	href: string;
}

export class MessageDTO {
	id: number;
	group_id: string;
	sent_by: string;
	message: string;
	sent_at: string;
	is_new: boolean;

	item: ItemDTO;
}

export class AuthDTO {
	username: string;
	password: string;
}

type ResData<T> = {
	data?: T | undefined;
	error?: string | undefined;
	status: number;
	username?: string | undefined;
	redirect?: string | undefined;
};
