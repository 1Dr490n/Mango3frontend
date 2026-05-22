<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Button from '../../../../lib/components/Button.svelte';
	import Error from '../../../../lib/components/Error.svelte';
	import Group from '../../../../lib/components/Group.svelte';
	import Input from '../../../../lib/components/Input.svelte';
	import TopBar from '../../../../lib/components/TopBar.svelte';
	import Tutorial from '../../../../lib/components/Tutorial.svelte';
	import type { GroupDTO } from '../../../../lib/types';

	export let data, form;
	let groups: GroupDTO[] = [];
	let error = '';
	let username = '';

	data.groups.then((response) => {
		if (response.redirect && browser) {
			goto(response.redirect);
		}
		if (response.data) {
			groups = response.data;
			username = response.username ?? '';
		} else {
			error = response.error ?? '';
		}
	});

	let url: string;
	$: url = `https://mango.thein.nl/invite/${data.id}`;

	let canShare = false;
	if (browser) {
		canShare = true;
	}

	let groupElement: HTMLInputElement;
	let formElement: HTMLFormElement;
</script>

<TopBar />
{#if browser && navigator && navigator.canShare && navigator.canShare() && navigator.share}
	<Button
		text="Share"
		onclick={() => {
			navigator.share({ url });
		}}
	/>
{/if}
<p>Share the link or send the invite into a chat.</p>
<Input value={url} placeholder="" />
<form method="post" action="?/send" bind:this={formElement} use:enhance>
	<input hidden bind:this={groupElement} name="group" />
</form>
{#each groups as group}
	<Group
		{group}
		onclick={() => {
			groupElement.value = group.id;
			formElement.submit();
		}}
	/>
{/each}
<Error error={error || form?.error} />
<Tutorial title="Sharing invites">
	You've created an invite! Now, send it into one of your chats by clicking on it or copy the link
	above and share it.
</Tutorial>
