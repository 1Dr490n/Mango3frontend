<script lang="ts">
	import type { GroupDTO, UserDTO } from '../types';
	import Dot from './Dot.svelte';

	export let group: GroupDTO | undefined;
	export let onclick: (() => void) | undefined = undefined;
	export let showNewActivity: boolean = false;
</script>

{#if group}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="flex hover:cursor-pointer {group.is_private
			? 'bg-pink-600'
			: group.id == 'public'
				? 'bg-orange-400'
				: 'bg-purple-600'} rounded-full p-3 mb-2 items-center"
		on:click={() => onclick && onclick()}
	>
		<!-- svelte-ignore a11y-missing-attribute -->
		<img src={group.picture || '/icon.png'} class=" w-16 aspect-square rounded-full object-cover" />
		<p class="text-xl ml-4">{group.name}</p>
		{#if showNewActivity && group.new_activity}
			<Dot color="new" />
		{/if}
	</div>
{/if}
