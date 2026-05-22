import { fail, type Actions } from '@sveltejs/kit';
import { API } from '../../lib/api';
import { validateEmail } from '../../lib/constants';

export const actions: Actions = {
	/*pushover: async ({ request, cookies, url }) => {
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
	}*/
	mail: async ({ request, cookies, url }) => {
		const form = await request.formData();

		const mail = form.get('mail')?.toString()?.trim() || '';

		if (mail && !validateEmail(mail)) {
			return fail(400, { invalidMail: true, mail });
		}

		const response = await API.post({
			resource: '/mail',
			data: { mail },
			url,
			cookies,
			mayRedirect: true
		});

		return { ...response, mail };
	}
};
