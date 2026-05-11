<script lang="ts">
	export let label: string;

	export let value: boolean = false;
	export let onchange: (value: boolean) => void = () => {};
</script>

<label class="inline-flex cursor-pointer items-end pr-6">
	<input
		checked={value}
		type="checkbox"
		class="peer sr-only"
		on:change={() => {
			value = !value;
			onchange(value);
		}}
	/>

	<div class="bg-light-bg peer-checked:bg-checked h-5 w-5 rounded-sm">
		{#if value}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="white"
				class="stroke-text size-5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
			</svg>
		{/if}
	</div>

	<span class="ms-3 text-sm">{label}</span>
</label>
