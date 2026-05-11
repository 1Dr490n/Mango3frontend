<script lang="ts">
	import { goto } from '$app/navigation';
	import Error from '../lib/components/Error.svelte';
	import Group from '../lib/components/Group.svelte';
	import TopBar from '../lib/components/TopBar.svelte';
	import Tutorial from '../lib/components/Tutorial.svelte';
	import type { GroupDTO } from '../lib/types';

	export let data;

	let groups: GroupDTO[] | undefined;
	$: groups = data.data;
</script>

<TopBar>
	<div class="justify-start flex">
		<button
			class="active:bg-fg flex justify-center items-center p-3 ml-1 rounded-full transition-colors aspect-square"
			on:click={() => goto('group/new')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
				/>
			</svg>
		</button>
	</div>
</TopBar>
<Error error={data.error} />
{#if groups}
	{#each groups as group}
		<Group
			{group}
			username={data.username}
			onclick={() => {
				goto(`group/${group.id}`);
			}}
			showNewActivity
		/>
	{/each}
{/if}

<div class="mt-5">
	<Tutorial title="Welcome!" expanded>
		This is a tutorial box. These will help you use all of Mango's features. You can disable
		tutorials in the settings.
	</Tutorial>
	<Tutorial title="Introduction">
		Mango III allows you to find friends, create groups or private chats with them and share all
		your favorite songs, albums and artists.
	</Tutorial>
	<Tutorial title="Basic navigation">
		<p>
			Click on the Mango at the top to return to this page from anywhere.<br />
			Click on the bars in the upper right to navigate to different pages.<br />
			Click on the symbol in the upper left for a special action that depends on the page.
		</p>
	</Tutorial>

	<Tutorial title="Completing your profile">
		<ol>
			<li class="flex">
				1. Click on <svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6 mx-2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg> in the upper right corner.
			</li>
			<li>2. Click on <b>Profile</b>.</li>
		</ol>
	</Tutorial>
	<Tutorial title="Enable notifications">
		To receive notifications when someone sends you a message, click on the bars in the upper right
		and then on <b>Settings</b>.
	</Tutorial>
	<Tutorial title="Creating a chat">
		<span class="flex">
			To find friends or create a new chat, click on the symbol in the upper left.
		</span>
	</Tutorial>
	<Tutorial title="Privacy note">
		Mango III is a lot more secure than the previous versions. Passwords are now encrypted so no one
		can access them, and I, the admin, won't see the contents of chats on accident anymore.<br />
		However, I still don't really know what I'm doing so don't share any sensitive information on here.
	</Tutorial>
</div>
