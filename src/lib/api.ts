import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { redirect, type Cookies } from '@sveltejs/kit';
import type { AuthDTO, ResData } from './types';
import { PUBLIC_API_URL } from '$env/static/public';

interface ApiParams {
	resource: string;
	url: URL | null | string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data?: Record<string, any> | null;
	auth?: AuthDTO;
	cookies?: Cookies;
}

export const api_url = PUBLIC_API_URL;

export function auth(cookies: Cookies): AuthDTO | undefined {
	const authStr = cookies.get('auth');
	const auth = authStr && JSON.parse(authStr);
	return auth;
}

async function request(method: string, params: ApiParams): Promise<ResData<any>> {
	const authStr = !params.auth && params?.cookies?.get('auth');
	const auth = params.auth || (authStr && JSON.parse(authStr));
	try {
		const res = await fetch(`${api_url}${params.resource}`, {
			method,
			headers: {
				Accept: 'application/json',
				...auth
			},
			body: params.data && JSON.stringify(params.data)
		});

		if (params.auth || params.cookies) checkUnauthorized(res, params.url || undefined);
		if (res.status == 500) {
			return { error: 'Internal server error', status: 500 };
		}

		const data = await res.json();

		if (!res.ok) {
			return { error: data.error || (('' + res.status) as string), status: res.status };
		}

		return { data, username: auth?.username, status: res.status };
	} catch (error: any) {
		if (error.status == 302) {
			throw error;
		}
		console.log(error);
		return { error: 'Cannot connect to server', status: 404 };
	}
}

export const API = {
	get: async (params: ApiParams) => {
		return request('GET', params);
	},

	post: async (params: ApiParams) => {
		return request('POST', params);
	},

	put: async (params: ApiParams) => {
		return request('PUT', params);
	},

	delete: async (params: ApiParams) => {
		return request('DELETE', params);
	}
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isApiError = (response: any) => {
	if (response.statusCode && response.error) return true;
	return false;
};

const checkUnauthorized = (res: Response, url?: URL | string) => {
	if (res.status === 401) {
		const redirectUrl = `/login/?redirect=${url || ''}`;
		if (browser) {
			goto(redirectUrl);
		} else {
			return {
				redirect: redirectUrl,
				error: 'Invalid credentials'
			};
		}
	}
};
