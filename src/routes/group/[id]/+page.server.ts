import { API, auth } from '../../../lib/api';
import type {
	GroupDTO,
	InviteDTO,
	ItemDTO,
	MessageDTO,
	ResData,
	UserDTO
} from '../../../lib/types';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params, url }) => {
	return { auth: auth(cookies), params, url: url.href };
};

/*export const load: PageServerLoad = async ({ cookies, params, url }) => {
	let response: {
		initial?: Promise<{
			group: ResData<GroupDTO>;
			messages: Promise<ResData<MessageDTO[]>>[];
			username: string | undefined;
		}>;
		users?: Promise<ResData<UserDTO[]>>;
	} = {};

	response.initial = new Promise<{
		group: ResData<GroupDTO>;
		messages: Promise<ResData<MessageDTO[]>>[];
		username: string | undefined;
	}>(async (resolve) => {
		const group: ResData<GroupDTO> = await API.get(
			{
				resource: `/group/${params.id}`,
				auth: true,
				url
			},
			cookies
		);

		const messages: Promise<ResData<MessageDTO[]>>[] = [];
		if (group.data) {
			for (let i = 0; i < group.data.message_count; i += 5) {
				messages.push(
					API.get(
						{
							resource: `/group/${params.id}/message?take=5&skip=${i}`,
							auth: true,
							url
						},
						cookies
					)
				);
			}
		}

		resolve({
			group,
			messages,
			username: group.username
		});
	});

	response.users = API.get({
		resource: `/group/${params.id}/users`,
		url
	});

	return response;
};*/
export const actions: Actions = {
	search: async ({ request, url }) => {
		const form = await request.formData();

		const search = form.get('search')?.toString()?.trim();
		const page = +(form.get('page') || 0);

		if (!search) {
			return fail(400, { searchInvalid: true, page });
		}

		const response: ResData<ItemDTO[]> = await API.get({
			resource: `/search?q=${search}&page=${page}`,
			url
		});

		if (response.error) {
			return fail(400, { error: response.error, search, page });
		}

		return { data: response.data, error: response.error, search, page: page };
	},
	send: async ({ cookies, request, params, url }) => {
		const form = await request.formData();

		const message = form?.get('message')?.toString() || '';
		const item = form?.get('item')?.toString();

		const response = await API.post({
			resource: `/group/${params.id}/message`,
			data: {
				item: item && JSON.parse(item),
				message
			},
			url,
			cookies
		});

		if (response.error) {
			return fail(400, { error: response.error, message, item });
		}

		return {};
	},
	delete: async ({ cookies, params, request, url }) => {
		const form = await request.formData();

		const messageId = +(form.get('message') || 0);

		const response = await API.delete({
			resource: `/group/${params.id}/message/${messageId}`,
			cookies,
			url
		});

		if (response.error) {
			return fail(400, { error: response.error });
		}
	},
	invite: async ({ cookies, params, url }) => {
		const response: ResData<InviteDTO> = await API.post({
			resource: `/group/${params.id}/invite`,
			data: {
				limit: 10
			},
			url,
			cookies
		});

		if (response.error) {
			return fail(400, { error: response.error });
		}

		redirect(302, `/invite/${response.data?.id}/share`);
	}
};
