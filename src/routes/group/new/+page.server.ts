import { type Actions, fail, redirect } from '@sveltejs/kit';
import { API } from '../../../lib/api';
import type { GroupDTO, InviteDTO, ResData, UserDTO } from '../../../lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const users: ResData<UserDTO[]> = await API.get({
		resource: `/user`,
		url,
		cookies
	});

	if (users.data && users.username) {
		const index = users.data.findIndex((x) => x.username == users.username);
		users.data = [...users.data.slice(0, index), ...users.data.slice(index + 1)];
	}

	return users;
};

export const actions: Actions = {
	group: async ({ request, cookies, url }) => {
		const form = await request.formData();

		const name = form.get('name')?.toString() || '';
		if (!name) {
			return fail(400, { isGroup: true, nameInvalid: true });
		}
		const response: ResData<GroupDTO> = await API.post({
			resource: '/group',
			data: {
				name
			},
			url,
			cookies
		});
		if (response.error) {
			return fail(400, { error: response.error, isGroup: true, name });
		}
		redirect(302, `/group/${response.data?.id}`);
	},
	private: async ({ cookies, url }) => {
		const response: ResData<InviteDTO> = await API.post({
			resource: '/invite',
			url,
			cookies,
			mayRedirect: true
		});

		if (response.error) {
			return fail(400, { error: response.error, isGroup: false });
		}

		redirect(302, `/invite/${response.data?.id}/share`);
	}
};
