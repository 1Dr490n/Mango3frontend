<script lang="ts">
	export let placeholder: string;
	export let value: string;
	export let disabled: boolean = false;
	export let name: string | undefined = undefined;
</script>

<textarea
	class="bg-fg mb-1 w-full rounded-md p-1"
	{value}
	on:input={(e) => {
		// @ts-ignore
		value = e?.target?.value;
	}}
	{placeholder}
	{disabled}
	{name}
/>
