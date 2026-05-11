import { API } from '../lib/api';
import type { GroupDTO, ResData } from '../lib/types';
import type { PageServerLoad } from './invite/$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const groups: ResData<GroupDTO[]> = await API.get(
		{
			resource: `/group`,
			auth: true,
			url
		},
		cookies
	);

	groups.data = groups.data?.filter((x) => x.name || x.users.length >= 2);

	return groups;
};
