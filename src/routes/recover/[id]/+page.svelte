<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '../../../lib/components/Button.svelte';
	import Input from '../../../lib/components/Input.svelte';
	import TopBar from '../../../lib/components/TopBar.svelte';

	export let form;
	let invalidPassword = false;
	let invalidConfirm = false;
	let password = '';
	let confirmPassword = '';
	$: {
		if (password) invalidPassword = password.length < 8;
		if (confirmPassword) invalidConfirm = password !== confirmPassword;
	}
</script>

<TopBar menu={false} />
<p class="text-red-500">{form?.error || ''}</p>
<p>Choose a new password</p>
<form
	class="mt-5"
	method="POST"
	use:enhance={() => {
		return async ({ update, result }) => {
			await update();
			invalidPassword = result.data?.invalidPassword;
			invalidConfirm = result.data?.invalidConfirm;
		};
	}}
>
	<Input
		bind:value={password}
		placeholder="New password"
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
			text="Update password"
			type="submit"
			color={!password || !confirmPassword || invalidPassword || invalidConfirm
				? 'bg-fg'
				: 'bg-confirm'}
			disabled={invalidPassword || invalidConfirm}
		/>
	</div>
</form>
