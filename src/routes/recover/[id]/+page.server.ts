import { type Actions, fail, redirect } from '@sveltejs/kit';
import { API } from '../../../lib/api';

export const actions: Actions = {
	default: async ({ request, params, cookies, url }) => {
		const form = await request.formData();

		const password = form.get('password')?.toString() || '';
		const confirmPassword = form.get('confirmpassword')?.toString() || '';

		let result = {
			invalid: false,
			invalidPassword: false,
			invalidConfirm: false,
			error: ''
		};

		if (password.length < 8) {
			result.invalid = true;
			result.invalidPassword = true;
		}
		if (password !== confirmPassword) {
			result.invalid = true;
			result.invalidConfirm = true;
		}

		if (result.invalid) {
			return fail(400, result);
		}

		const response = await API.post({
			resource: `/recover/${params.id}`,
			data: { new_password: password },
			url: null
		});

		if (response.error) {
			result.invalid = true;
			result.error = response.error;
			return fail(400, result);
		}

		redirect(302, '/');
	}
};
