<script lang="ts">
	export let color: string;
	export let visible: boolean = true;
</script>

<!--span
	class="ml-1 h-2 w-2 rounded-full"
	style="background-color: var(--icon-{color}); display: {visible ? 'inline-block' : 'none'}"
	>New</span
-->

{#if visible}
	<span
		class="px-0.5 ml-1 text-sm inline-block rounded-md text-opacity-40 text-black opacity-80"
		style="background-color: var(--icon-{color});">{color}</span
	>
{/if}
