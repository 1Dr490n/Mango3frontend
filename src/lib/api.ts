import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { redirect, type Cookies } from '@sveltejs/kit';
import type { ResData } from './types';
import { PUBLIC_API_URL } from '$env/static/public';

interface ApiParams {
	resource: string;
	url: URL | null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data?: Record<string, any> | null;
	auth?: boolean;
}

//export const url = 'https://garage-coconut-dyslexia.ngrok-free.dev';
//export const url = 'http://localhost:8080';
export const api_url = PUBLIC_API_URL;

export function auth(cookies: Cookies): { username: string; password: string } | undefined {
	const authStr = cookies.get('auth');
	const auth = authStr && JSON.parse(authStr);
	return auth;
}

async function request(
	method: string,
	params: ApiParams,
	cookies: Cookies | undefined
): Promise<ResData<any>> {
	const authStr = params.auth && cookies?.get('auth');
	const auth = authStr && JSON.parse(authStr);
	try {
		const res = await fetch(`${api_url}${params.resource}`, {
			method,
			headers: {
				Accept: 'application/json',
				...(auth && {
					username: auth.username,
					password: auth.password
				})
			},
			body: params.data && JSON.stringify(params.data)
		});

		if (params.auth) checkUnauthorized(res, params.url || undefined);
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
	get: async (params: ApiParams, cookies?: Cookies | undefined) => {
		return request('GET', params, cookies);
	},

	post: async (params: ApiParams, cookies?: Cookies | undefined) => {
		return request('POST', params, cookies);
	},

	put: async (params: ApiParams, cookies?: Cookies | undefined) => {
		return request('PUT', params, cookies);
	},

	delete: async (params: ApiParams, cookies?: Cookies | undefined) => {
		return request('DELETE', params, cookies);
	}
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isApiError = (response: any) => {
	if (response.statusCode && response.error) return true;
	return false;
};

const checkUnauthorized = (res: Response, url?: URL) => {
	if (res.status === 401) {
		const redirectUrl = `/login/?redirect=${url || ''}`;
		if (browser) {
			goto(redirectUrl);
		} else {
			redirect(302, redirectUrl);
		}
	}
};
