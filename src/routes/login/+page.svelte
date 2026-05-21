<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '../../lib/components/Button.svelte';
	import Input from '../../lib/components/Input.svelte';
	import TopBar from '../../lib/components/TopBar.svelte';
	import Error from '../../lib/components/Error.svelte';
	import { browser } from '$app/environment';

	export let data;
	export let form;
	let invalidUsername = false;
	let invalidPassword = false;
	let username = data.username || '';
	let password = data.password || '';
	$: {
		username = username.toLowerCase();
		if (username) invalidUsername = !username.match(`^[a-z0-9_\-]{4,20}$`);
		if (password) invalidPassword = password.length < 8;
	}

	let redirect: string;
	if (browser && location) {
		redirect = (browser && location && new URLSearchParams(location.search).get('redirect')) || '/';
	}
</script>

<TopBar menu={false} />
<Error error={form?.error} />
<form
	class="mt-5"
	method="POST"
	use:enhance={() => {
		return async ({ update, result }) => {
			await update();
			invalidUsername = result.data?.invalidUsername;
			invalidPassword = result.data?.invalidPassword;
			username = result.data?.username || data.username || '';
			password = result.data?.password || data.password || '';
		};
	}}
>
	<Input
		bind:value={username}
		placeholder="Username"
		name="username"
		error={invalidUsername &&
			'Username must be between 4 and 20 characters and only contain a-z, 0-9, _, -'}
	/>
	<Input
		bind:value={password}
		placeholder="Password"
		type="password"
		name="password"
		error={invalidPassword && 'Password must be at least 8 characters'}
	/>
	<div class="mt-2">
		<Button
			text="Log in"
			type="submit"
			color={!username || !password || invalidUsername || invalidPassword ? 'bg-fg' : 'bg-confirm'}
			disabled={invalidPassword || invalidUsername}
		/>
	</div>
	<div class="flex justify-center">
		<a
			href={`/signup?username=${username}&password=${password}&redirect=${redirect}`}
			class="text-sm underline">Don't have an account yet? Sign up here</a
		>
	</div>
</form>
