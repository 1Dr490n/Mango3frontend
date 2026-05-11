<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '../../lib/components/Button.svelte';
	import Error from '../../lib/components/Error.svelte';
	import Input from '../../lib/components/Input.svelte';
	import TopBar from '../../lib/components/TopBar.svelte';

	export let form;

	let invalidDevice = false;
	let device: string | null = null;
	$: {
		if (device !== null) invalidDevice = !device;
	}
</script>

<TopBar />
<div class="text-sm">
	<p>
		Pushover allows you to receive notifications when someone sends you a song. To use it, follow
		this guide:
	</p>
	<ol>
		<li>
			1. Download the app in the <a
				href="https://apps.apple.com/de/app/pushover-notifications/id506088175?l=en-GB
Pushover Notifications">App Store</a
			>
			or
			<a
				href="https://play.google.com/store/apps/details?id=net.superblock.pushover&pcampaignid=web_share"
				>Play Store</a
			>
		</li>
		<li>
			2. Open the app and <b>login</b> using the email <u>mangonotification@gmail.com</u> and
			password
			<u>jimvym-cydnuq-8hyRva</u>
		</li>
		<li>3. Enter a device name. It should include your account's username</li>
		<li>
			4. (Recommended) In the Pushover app's settings, scroll down to <b>Advanced settings</b>.
			There, turn on <b>Auto-open URLs</b> as well as <b>Hide Pushover logo</b>. By doing this, you
			simply have to click on a notification to go straight to Mango.
		</li>
		<li>5. Register your device by entering that device name below and pressing <b>Submit</b></li>
		<li>
			6. If all goes well, you should receive a notification with a verification link. Simply click
			on that notification. Your device should register now.
		</li>
	</ol>
</div>
<form
	method="post"
	action="?/pushover"
	use:enhance={() => {
		return async ({ update, result }) => {
			await update();
			invalidDevice = result.data?.invalidDevice;
			device = result.data?.device || '';
		};
	}}
>
	<Input
		placeholder="Pushover device"
		bind:value={device}
		name="device"
		error={invalidDevice && 'Invalid device name'}
	/>
	<Button type="submit" text="Register" color="bg-confirm" />
</form>
<Error error={form?.error} />
