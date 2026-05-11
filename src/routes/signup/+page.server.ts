import { type Actions, fail, redirect } from '@sveltejs/kit';
import { API } from '../../lib/api';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ url }) => {
	return {
		username: url.searchParams.get('username') || '',
		password: url.searchParams.get('password') || ''
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();

		const username = form.get('username')?.toString()?.toLowerCase() || '';
		const displayName = form.get('displayname')?.toString() || '';
		const password = form.get('password')?.toString() || '';
		const confirmPassword = form.get('confirmpassword')?.toString() || '';

		let result = {
			invalid: false,
			invalidUsername: false,
			invalidPassword: false,
			invalidConfirm: false,
			error: ''
		};

		if (!username.match(`^[a-z0-9_\-]{4,20}$`)) {
			result.invalid = true;
			result.invalidUsername = true;
		}
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
			resource: '/signup',
			data: { username: username, password: password, display_name: displayName },
			url: null
		});

		if (response.error) {
			result.invalid = true;
			result.error = response.error;
			return fail(400, result);
		}

		cookies.set('auth', JSON.stringify({ username, password }), {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: import.meta.env.VITE_ENV === 'prod'
		});

		redirect(302, url.searchParams.get('redirect') || '/');
	}
};
