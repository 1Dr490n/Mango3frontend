import type { PageServerLoad } from '../$types';
import { API } from '../../lib/api';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const response = await API.post(
		{
			resource: `/pushover/verify/?code=${url.searchParams.get('code')}`,
			auth: true,
			url
		},
		cookies
	);

	return response;
};
