import { type Actions, fail, redirect } from '@sveltejs/kit';
import { API } from '../../lib/api';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const str = cookies.get('auth')?.toString();
	if (str) {
		const auth = JSON.parse(str);
		return { username: auth.username, password: auth.password };
	}
	return { username: '', password: '' };
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();

		const username = form.get('username')?.toString()?.toLowerCase() || '';
		const password = form.get('password')?.toString() || '';

		let result = {
			invalid: false,
			username: username,
			password: password,
			invalidUsername: false,
			invalidPassword: false,
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

		if (result.invalid) {
			return fail(400, result);
		}

		const response = await API.post({
			resource: '/login',
			data: { username: username!.toString(), password: password!.toString() },
			url: null
		});

		if (response.status == 401) {
			result.invalid = true;
			result.error = 'Invalid credentials';
			return fail(400, result);
		}

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
