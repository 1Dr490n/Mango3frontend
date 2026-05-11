<script lang="ts">
	import { slide } from 'svelte/transition';
	import Input from '../../../lib/components/Input.svelte';
	import TopBar from '../../../lib/components/TopBar.svelte';
	import Button from '../../../lib/components/Button.svelte';
	import Error from '../../../lib/components/Error.svelte';
	import { enhance } from '$app/forms';
	import User from '../../../lib/components/User.svelte';
	import Tutorial from '../../../lib/components/Tutorial.svelte';

	export let data, form;
	let isGroup: boolean = form?.isGroup || false;
	let name = form?.name || '';
	let nameInvalid = form?.nameInvalid;

	$: {
		if (form) nameInvalid = !name;
	}
</script>

<TopBar />
<div class="flex justify-center">
	<div class="bg-fg rounded-md">
		<button
			class="text-text text-xl p-2 rounded-md {!isGroup ? 'bg-confirm' : ''} transition-colors"
			on:click={() => {
				isGroup = false;
			}}>Private</button
		>
		<button
			class="text-text text-xl p-2 rounded-md {isGroup ? 'bg-confirm' : ''} transition-colors"
			on:click={() => {
				isGroup = true;
			}}>Group</button
		>
	</div>
</div>
<form
	class="flex justify-center mt-4"
	method="post"
	action={isGroup ? '?/group' : '?/private'}
	use:enhance
>
	<div class="w-2/3 min-w-2/3">
		{#if isGroup}
			<div transition:slide class="mb-4">
				<Input
					name="name"
					placeholder="Name"
					bind:value={name}
					error={nameInvalid && 'Name must not be empty'}
				/>
			</div>
		{/if}
		<Button text={isGroup ? 'Create' : 'Invite'} type="Submit" color="bg-confirm" />
	</div>
</form>
{#if !isGroup && data.data}
	<div transition:slide>
		{#each data.data as user}
			<User {user} />
		{/each}
	</div>
{/if}
<Error error={data.error || form?.error} />
<Tutorial title="Creating a private chat">
	To create a private chat, select <b>Private</b> above. Now, either click on someone in the list of
	users below that or send an invitation link using the <b>Invite</b> button.
</Tutorial>
<Tutorial title="Creating a group chat">
	To create a group chat, select <b>Group</b> above, enter a name for your group and hit
	<b>Create</b>. You can invite people to it later.
</Tutorial>
