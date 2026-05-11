import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { auth } from '../../lib/api';

export const load: PageServerLoad = async ({ cookies }) => {
	const username = auth(cookies)?.username;
	redirect(302, `/profile/${username}`);
};
