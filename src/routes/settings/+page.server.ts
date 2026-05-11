import { fail, type Actions } from '@sveltejs/kit';
import { API } from '../../lib/api';

export const actions: Actions = {
	pushover: async ({ request, cookies, url }) => {
		const form = await request.formData();

		const device = form.get('device')?.toString()?.trim();

		if (!device) {
			return fail(400, { invalidDevice: true });
		}

		const response = await API.post(
			{
				resource: '/pushover',
				data: { device },
				auth: true,
				url
			},
			cookies
		);

		return response;
	}
};
