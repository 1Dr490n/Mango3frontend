<script lang="ts">
	export let placeholder: string;
	export let value: string | number | undefined | null;
	export let type: string = 'text';
	export let name: string | undefined = undefined;
	export let disabled: boolean = false;

	export let onenter: ((value: string | number | undefined | null) => void) | undefined = undefined;
	export let onchange: ((e: Event) => void) | undefined = undefined;
	export let error: any = undefined;
</script>

<div>
	<input
		class="bg-fg mb-1 w-full rounded-md p-1 {error
			? 'border-solid border-red-400 border-2'
			: ''} p-2"
		{value}
		{name}
		on:input={(e) => {
			// @ts-ignore
			value = e?.target?.value;
		}}
		{placeholder}
		{type}
		{disabled}
		on:keydown={(e) => {
			if (e.key === 'Enter' && onenter) onenter(value);
		}}
		on:change={onchange}
	/>
	{#if error}
		<p class="text-red-400 text-xs">{error}</p>
	{/if}
</div>
