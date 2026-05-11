import { API } from '../../../lib/api';
import type { GroupDTO, InviteDTO, ResData } from '../../../lib/types';
import type { PageServerLoad } from '../$types';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ cookies, params, url }) => {
	const invite: ResData<InviteDTO> = await API.get(
		{
			resource: `/invite/${params.id}`,
			url
		},
		cookies
	);

	return invite;
};
export const actions: Actions = {
	default: async ({ params, cookies, url }) => {
		const response: ResData<GroupDTO> = await API.post(
			{
				resource: `/invite/${params.id}`,
				auth: true,
				url
			},
			cookies
		);

		if (response.error) {
			return fail(400, { error: response.error });
		}

		redirect(302, '/');
	}
};
