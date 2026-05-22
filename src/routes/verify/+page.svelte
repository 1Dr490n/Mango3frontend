<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Error from '../../lib/components/Error.svelte';
	import Loader from '../../lib/components/Loader.svelte';
	import TopBar from '../../lib/components/TopBar.svelte';

	export let data;
	data.response.then((x) => {
		if (x.redirect && browser) {
			goto(x.redirect);
		}
	});
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
