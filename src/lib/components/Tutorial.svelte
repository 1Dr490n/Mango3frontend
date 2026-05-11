<script lang="ts">
	import { slide } from 'svelte/transition';

	export let title: string;

	export let expanded = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="bg-sky-500 rounded-xl p-2 mt-2"
	on:click={() => {
		expanded = !expanded;
	}}
>
	<p class="text-text">{title}</p>
	{#if expanded}
		<div transition:slide class="bg-sky-600 p-2 rounded-xl">
			<slot />
		</div>
	{/if}
</div>
