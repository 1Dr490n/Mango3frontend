<script lang="ts">
	import Button from '../../../lib/components/Button.svelte';
	import Error from '../../../lib/components/Error.svelte';
	import TopBar from '../../../lib/components/TopBar.svelte';
	import User from '../../../lib/components/User.svelte';
	import type { InviteDTO } from '../../../lib/types';
	import { enhance } from '$app/forms';
	import Tutorial from '../../../lib/components/Tutorial.svelte';

	export let data;
	let invite: InviteDTO | undefined;
	$: invite = data.data;

	export let form;
</script>

<TopBar />
{#if invite}
	<div class="flex justify-center text-xl">
		{invite.group?.name ?? 'Private chat'}
	</div>
	<div class="flex justify-center text-sm">
		{invite.sent_by.display_name || invite.sent_by.username} invited you!
	</div>
	<div class="flex justify-center text-sm">
		{new Date(invite.sent_at).toLocaleDateString()}
		{new Date(invite.sent_at).toLocaleTimeString()}
	</div>

	{#each invite.group?.users ?? [invite.sent_by] as member}
		<User user={member} />
	{/each}

	<div class="flex justify-center">
		<form class="w-1/2" method="post" use:enhance>
			<Button text="Accept" color="bg-confirm" type="submit" />
		</form>
	</div>
{/if}
<Error error={data.error || form?.error} />
