import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { API } from '../../../../lib/api';
import type { GroupDTO, InviteDTO, ResData } from '../../../../lib/types';

export const load: PageServerLoad = async ({ params, cookies, url }) => {
	const groups: Promise<ResData<GroupDTO[]>> = API.get({
		resource: `/group`,
		url,
		cookies
	});

	return {
		groups,
		id: params.id
	};
	/*groups.data = groups.data?.filter((x) => x.name || x.users.length >= 2);

	return { ...groups, id: params.id };*/
};

export const actions: Actions = {
	send: async ({ params, cookies, request, url }) => {
		const formData = await request.formData();

		const groupId = formData.get('group');

		if (!groupId) {
			return fail(400, { error: 'Group not set' });
		}

		const invite: ResData<InviteDTO> = await API.get({
			resource: `/invite/${params.id}`,
			url,
			cookies,
			mayRedirect: true
		});

		if (invite.error || !invite.data) {
			return invite;
		}

		const group: ResData<GroupDTO> = await API.get({
			resource: `/group/${groupId}`,
			url,
			cookies,
			mayRedirect: true
		});

		if (group.error || !group.data) {
			return group;
		}

		const response = await API.post({
			resource: `/group/${groupId}/message`,
			data: {
				message: 'View this invite by clicking on the image!',
				item: {
					name: invite.data.group.name,
					type: 'invite',
					id: params.id,
					artist: '',
					image: invite.data.group.picture,
					href: `/invite/${params.id}`
				}
			},
			url,
			cookies,
			mayRedirect: true
		});

		return response;
	}
};
