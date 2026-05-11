<script lang="ts">
	export let text: string;
	export let onclick: (() => void) | undefined = undefined;
	export let color = 'bg-fg';
	export let type: string = 'button';
	export let formaction: string | undefined = undefined;
	export let formmethod: string | undefined = undefined;
	export let disabled: boolean = false;
</script>

<input
	{type}
	class="mb-1 w-full rounded-full {color} hover:cursor-pointer} p-3"
	on:click={onclick}
	value={text}
	{formaction}
	{formmethod}
	{disabled}
/>
