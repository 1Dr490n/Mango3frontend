import type { PageServerLoad } from '../$types';
import { API } from '../../lib/api';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const response = API.post({
		resource: `/mail/verify/?code=${url.searchParams.get('code')}`,
		cookies,
		url
	});

	return { response };
};
