<script lang="ts">
	export let error: string | null | undefined;
</script>

<p class="text-red-500">{error || ''}</p>
