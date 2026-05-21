import { API, auth } from '../lib/api';
import type { GroupDTO, ResData } from '../lib/types';
import type { PageServerLoad } from './invite/$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
	return { auth: auth(cookies), url: url.href };
	/*const groups = new Promise<Promise<ResData<GroupDTO[]>>[]>(async (resolve, reject) => {
		const count: ResData<{ count: number }> = await API.get(
			{
				resource: `/group/count`,
				auth: true,
				url
			},
			cookies
		);
		if (!count.data) {
			reject(count);
			return;
		}
		const groups: Promise<ResData<GroupDTO[]>>[] = [];
		for (let i = 0; i < count.data.count; i += 5) {
			groups.push(
				API.get(
					{
						resource: `/group?take=5&skip=${i}`,
						auth: true,
						url
					},
					cookies
				)
			);
		}

		resolve(groups);
	});
	return {
		groups
	};*/
};
