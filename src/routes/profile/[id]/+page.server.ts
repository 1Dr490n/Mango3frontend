import { redirect } from '@sveltejs/kit';
import { API, auth } from '../../../lib/api';
import type { GroupDTO, ResData, UserDTO } from '../../../lib/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies, url }) => {
	const user: Promise<ResData<UserDTO>> = API.get({
		resource: `/user/${params.id}`,
		url,
		cookies
	});

	return { user };
};

export const actions: Actions = {
	save: async ({ request, cookies, url }) => {
		const form = await request.formData();

		const displayName = form.get('displayname')?.toString() || '';
		const bio = form.get('bio')?.toString() || '';

		const response = await API.put({
			resource: '/user',
			data: { display_name: displayName, bio, profile_pic: true },
			url,
			cookies
		});

		return response;
	},
	message: async ({ cookies, params, url }) => {
		const group: ResData<GroupDTO> = await API.get({
			resource: `/group/user/${params.id}`,
			url,
			cookies,
			mayRedirect: true
		});
		if (group.error) {
			return group;
		}

		redirect(302, `/group/${group.data?.id}`);
	}
};
