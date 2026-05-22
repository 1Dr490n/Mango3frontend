<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '../../lib/components/Button.svelte';
	import Error from '../../lib/components/Error.svelte';
	import Input from '../../lib/components/Input.svelte';
	import TopBar from '../../lib/components/TopBar.svelte';
	import { validateEmail } from '../../lib/constants';

	export let form;

	let invalidMail = false;
	let mail: string | null = null;
	let sentVerification = false;
	$: {
		if (mail !== null) invalidMail = !!mail && !validateEmail(mail);
	}
</script>

<TopBar />
<form
	method="post"
	action="?/mail"
	use:enhance={() => {
		return async ({ update, result }) => {
			await update();
			//@ts-ignore
			invalidMail = result.data?.invalidMail;
			//@ts-ignore
			mail = result.data?.mail || '';
			if (invalidMail) sentVerification = false;
		};
	}}
	on:submit={() => {
		sentVerification = true;
	}}
>
	<p class="mb-2">
		Add an e-mail to receive notifications whenever someone sends you a message. Leave empty and
		press <b>Unsubscribe</b> to stop receiving e-mails.
	</p>
	<Input
		placeholder="E-Mail"
		bind:value={mail}
		name="mail"
		error={invalidMail && 'Invalid e-mail'}
	/>
	{#if sentVerification}
		<p class="text-sm">
			Please verify your e-mail by clicking on the button in the e-mail you've been sent. It may
			take a few seconds for the e-mail to arrive.<br />
			Didn't get the mail? Check the spam folder, otherwise press the button below again.
		</p>
	{/if}
	<Button type="submit" text={mail ? 'Register' : 'Unsubscribe'} color="bg-confirm" />
</form>
<Error error={form?.error} />
