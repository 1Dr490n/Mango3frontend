<script lang="ts">
	import Error from '../../lib/components/Error.svelte';
	import Loader from '../../lib/components/Loader.svelte';
	import TopBar from '../../lib/components/TopBar.svelte';

	export let data;
</script>

<TopBar />
{#await data.response}
	<Loader />
{:then response}
	{#if response.status == 200}
		<p>Your e-mail has been registered</p>
		<p>You can close this page now.</p>
	{/if}
	<Error error={response.error} />
{/await}
