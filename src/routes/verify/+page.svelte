<script lang="ts">
	import Error from '../../lib/components/Error.svelte';
	import TopBar from '../../lib/components/TopBar.svelte';

	export let data;
</script>

<TopBar />
{#if data.status == 200}
	<p>Your device has been registered</p>
	<p>You can close this page now.</p>
{/if}
<Error error={data.error} />
