import { API } from '../../../lib/api';
import type { GroupDTO, InviteDTO, ItemDTO, MessageDTO, ResData } from '../../../lib/types';
import type { PageServerLoad } from '../../$types';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ cookies, params, url }) => {
	let response: {
		group?: GroupDTO | undefined;
		messages?: MessageDTO[] | undefined;
		error?: string | undefined;
		status?: number;
		username?: string | undefined;
	} = {};

	const group: ResData<GroupDTO> = await API.get(
		{
			resource: `/group/${params.id}`,
			auth: true,
			url
		},
		cookies
	);

	if (!group.data || group.error) {
		response = { ...response, ...group };
		return response;
	}

	response.group = group.data;
	response.username = group.username;

	const messages: ResData<MessageDTO[]> = await API.get(
		{
			resource: `/group/${params.id}/message`,
			auth: true,
			url
		},
		cookies
	);
	response.messages = messages.data;

	response.error = group.error || messages.error;
	response.status = messages.status;

	return response;
};
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

		const response = await API.post(
			{
				resource: `/group/${params.id}/message`,
				auth: true,
				data: {
					item: item && JSON.parse(item),
					message
				},
				url
			},
			cookies
		);

		if (response.error) {
			return fail(400, { error: response.error, message, item });
		}

		return {};
	},
	delete: async ({ cookies, params, request, url }) => {
		const form = await request.formData();

		const messageId = +(form.get('message') || 0);

		const response = await API.delete(
			{
				resource: `/group/${params.id}/message/${messageId}`,
				auth: true,
				url
			},
			cookies
		);

		if (response.error) {
			return fail(400, { error: response.error });
		}
	},
	invite: async ({ cookies, params, url }) => {
		const response: ResData<InviteDTO> = await API.post(
			{
				resource: `/group/${params.id}/invite`,
				auth: true,
				data: {
					limit: 10
				},
				url
			},
			cookies
		);

		if (response.error) {
			return fail(400, { error: response.error });
		}

		redirect(302, `/invite/${response.data?.id}/share`);
	}
};
