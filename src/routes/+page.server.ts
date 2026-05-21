import { API, auth } from '../lib/api';
import type { GroupDTO, ResData } from '../lib/types';
import type { PageServerLoad } from './invite/$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
	//return { auth: auth(cookies), url: url.href };
	/*const groups = new Promise<Promise<ResData<GroupDTO[]>>[]>(async (resolve, reject) => {
		const count: ResData<{ count: number }> = await API.get({
			resource: `/group/count`,
			url,
			cookies
		});
		if (!count.data) {
			reject(count);
			return;
		}
		const groups: Promise<ResData<GroupDTO[]>>[] = [];
		for (let i = 0; i < count.data.count; i += 5) {
			groups.push(
				API.get({
					resource: `/group?take=5&skip=${i}`,
					cookies,
					url
				})
			);
		}

		resolve(groups);
	});
	return {
		groups
	};*/

	const response: Promise<{
		count: number;
		groups: Promise<ResData<GroupDTO[]>>[];
		error: string | undefined;
	}> = (async () => {
		const count: ResData<{ count: number }> = await API.get({
			resource: `/group/count`,
			cookies,
			url
		});
		let groups: Promise<ResData<GroupDTO[]>>[] = [];
		if (count.data) {
			groups = Array<Promise<ResData<GroupDTO[]>>>(count.data.count);
			for (let i = 0; i < count.data.count; i += 1) {
				const promise: Promise<ResData<GroupDTO[]>> = API.get({
					resource: `/group?take=1&skip=${i}`,
					cookies,
					url
				});
				groups[i] = promise;
			}
		}
		return {
			count: count.data?.count ?? 0,
			error: count.error,
			groups
		};
	})();
	return { response };
};
