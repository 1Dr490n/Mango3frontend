import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { API } from '../../../../lib/api';
import type { GroupDTO, MessageDTO, ResData, ItemDTO, InviteDTO } from '../../../../lib/types';

export const load: PageServerLoad = async ({ cookies, params, url }) => {
	const group: ResData<GroupDTO> = await API.get(
		{
			resource: `/group/${params.id}`,
			auth: true,
			url
		},
		cookies
	);

	return group;
};
export const actions: Actions = {
	save: async ({ request, cookies, params, url }) => {
		const form = await request.formData();
		const name = form.get('name') || null;
		const response: ResData<GroupDTO> = await API.put(
			{
				resource: `/group/${params.id}`,
				auth: true,
				url,
				data: {
					name,
					picture: true
				}
			},
			cookies
		);
		return response;
	},
	leave: async ({ cookies, params, url }) => {
		const response = await API.delete(
			{
				resource: `/group/${params.id}`,
				auth: true,
				url
			},
			cookies
		);

		if (response.error) {
			return response;
		}

		redirect(300, '/');
	}
};
