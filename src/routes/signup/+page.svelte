<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '../../lib/components/Button.svelte';
	import Input from '../../lib/components/Input.svelte';
	import TopBar from '../../lib/components/TopBar.svelte';

	export let data, form;
	let invalidUsername = false;
	let invalidPassword = false;
	let invalidConfirm = false;
	let username = data.username;
	let password = data.password;
	let confirmPassword = '';
	$: {
		username = username.toLowerCase();
		if (username) invalidUsername = !username.match(`^[a-z0-9_\-]{4,20}$`);
		if (password) invalidPassword = password.length < 8;
		if (confirmPassword) invalidConfirm = password !== confirmPassword;
	}
</script>

<TopBar menu={false} />
<p class="text-red-500">{form?.error || ''}</p>
<form
	class="mt-5"
	method="POST"
	use:enhance={() => {
		return async ({ update, result }) => {
			await update();
			invalidUsername = result.data?.invalidUsername;
			invalidPassword = result.data?.invalidPassword;
			invalidConfirm = result.data?.invalidConfirm;
		};
	}}
>
	<Input
		bind:value={username}
		placeholder="Username"
		error={invalidUsername &&
			'Username must be between 4 and 20 characters and only contain a-z, 0-9, _, -'}
		name="username"
	/>
	<Input value="" placeholder="Display name" name="displayname" />
	<Input
		bind:value={password}
		placeholder="Password"
		type="password"
		error={invalidPassword && 'Password must be at least 8 characters'}
		name="password"
	/>
	<Input
		bind:value={confirmPassword}
		placeholder="Confirm password"
		type="password"
		error={invalidConfirm && 'Passwords do not match'}
		name="confirmpassword"
	/>
	<div class="mt-2">
		<Button
			text="Sign up"
			type="submit"
			color={!username ||
			!password ||
			!confirmPassword ||
			invalidUsername ||
			invalidPassword ||
			invalidConfirm
				? 'bg-fg'
				: 'bg-confirm'}
			disabled={invalidPassword || invalidUsername || invalidConfirm}
		/>
	</div>
</form>
<div class="flex justify-center">
	<a href="/login" class="text-sm underline">Already have an account? Sign in here</a>
</div>
