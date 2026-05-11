<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import ThemePreview from '$lib/components/ThemePreview.svelte';
	import { colors } from '$lib/constants';
</script>

<div class="max-w-96">
	<ThemePreview />

	{#each colors as color}
		<input type="color" value={the}/>
	{/each}
</div>
