import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ cookies }) => {
	cookies.delete('auth', {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: import.meta.env.VITE_ENV === 'prod'
	});
	redirect(302, '/login');
};
