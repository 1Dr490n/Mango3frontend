<script lang="ts">
	export let color: string;
	export let visible: boolean = true;
</script>

<span
	class="ml-1 h-2 w-2 rounded-full"
	style="background-color: var(--icon-{color}); display: {visible ? 'inline-block' : 'none'}"
></span>
