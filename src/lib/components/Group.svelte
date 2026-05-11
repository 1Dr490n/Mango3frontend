<script lang="ts">
	import type { GroupDTO, UserDTO } from '../types';
	import Dot from './Dot.svelte';

	export let group: GroupDTO;
	export let username: string | undefined;
	export let onclick: ((otherUser: UserDTO | undefined) => void) | undefined = undefined;
	export let showNewActivity: boolean = false;

	let otherUser: UserDTO | undefined = undefined;
	let name: string;
	$: {
		if (!group.name) {
			otherUser = group.users.find((x) => x.username !== username);
			name = otherUser!.display_name || otherUser!.username;
		} else name = group.name;
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="flex hover:cursor-pointer {!group.name
		? 'bg-pink-600'
		: 'bg-purple-600'} rounded-full p-3 mb-2 items-center"
	on:click={() => onclick && onclick(otherUser)}
>
	<!-- svelte-ignore a11y-missing-attribute -->
	<img
		src={otherUser?.profile_pic || group.picture || '/icon.png'}
		class=" w-16 aspect-square rounded-full object-cover"
	/>
	<p class="text-xl ml-4">{name}</p>
	{#if showNewActivity && group.new_activity}
		<Dot color="new" />
	{/if}
</div>
