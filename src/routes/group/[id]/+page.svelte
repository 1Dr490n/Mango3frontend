<script lang="ts">
	import Group from '../../../lib/components/Group.svelte';
	import TopBar from '../../../lib/components/TopBar.svelte';
	import Error from '../../../lib/components/Error.svelte';
	import Input from '../../../lib/components/Input.svelte';
	import Item from '../../../lib/components/Item.svelte';
	import Button from '../../../lib/components/Button.svelte';
	import type { GroupDTO, ItemDTO, MessageDTO, ResData, UserDTO } from '../../../lib/types';
	import { applyAction, enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import Tutorial from '../../../lib/components/Tutorial.svelte';
	import { browser } from '$app/environment';
	import Loader from '../../../lib/components/Loader.svelte';
	import { onMount } from 'svelte';
	import { API } from '../../../lib/api';

	export let data;
	export let form;
	let search: string | null = form?.search || null;
	let searchInvalid: boolean = form?.searchInvalid || false;
	$: searchInvalid = search !== null && !search;

	let group: GroupDTO | undefined = undefined;
	let error: string = '';
	let messages: (MessageDTO | (undefined & { sentBy: UserDTO | undefined }))[] = [];

	onMount(async () => {
		try {
			const groupRes: ResData<GroupDTO> = await API.get({
				resource: `/group/${data.params.id}`,
				auth: data.auth,
				url: data.url
			});

			if (!groupRes.data) {
				error = groupRes.error || '';
				return;
			}
			group = groupRes.data;
			messages = Array(group.message_count);

			for (let i = 0; i < group.message_count; i += 1) {
				const promise: Promise<ResData<MessageDTO[]>> = API.get({
					resource: `/group/${data.params.id}/message?take=1&skip=${i}`,
					auth: data.auth,
					url: data.url
				});
				promise.then((res) => {
					loaded++;
					if (res.data) {
						messages[i] = res.data[0];
					}
				});
			}

			/*response.users = API.get({
			resource: `/group/${params.id}/users`,
			url
		});*/
		} catch (e) {
			console.error(e);
		}
	});

	/*$: messages =
		data.messages?.map((x) => {
			return {
				...x,
				sentBy: data.group?.users?.find((y) => y.username === x.sent_by) || undefined
			};
		}) ?? [];*/

	let users: Map<string, UserDTO> | undefined;

	let loaded = 0;

	/*if (data.users) {
		data.users.then((x) => {
			users = new Map();
			for (const user of x.data || []) {
				users.set(user.username, user);
			}
		});
	}*/

	let items: ItemDTO[] = [];
	let page = 0;

	let audio: HTMLAudioElement | null = null;

	let selectedItem: ItemDTO | null = null;

	let expandedItem: number | null = null;

	if (browser) {
		console.log('Showing', new Date().toISOString());
	}
</script>

<TopBar>
	{#if group?.name}
		<form class="justify-start flex" method="post" action="?/invite" use:enhance>
			<button
				class="active:bg-fg flex justify-center items-center p-3 ml-1 rounded-full transition-colors aspect-square"
				type="submit"
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
						d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
					/>
				</svg>
			</button>
		</form>
	{/if}
</TopBar>
{#if group}
	<!--Group
		{initial.group}
		{...{
			/*onclick={() => {
			if (otherUser) goto(`/profile/${otherUser.username}`);
			else goto(`/group/${data.group?.id}/edit`);
		}}
		username={data.username || ''}
		*/
		}}
	/-->
	<Group {group} />
	{#if selectedItem}
		<Item item={selectedItem} />
		<form
			method="post"
			action="?/send"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					selectedItem = null;
					items = [];
					search = null;
				};
			}}
		>
			<input type="hidden" value={JSON.stringify(selectedItem)} name="item" />
			<Input value="" placeholder="Message" name="message" />
			<div class="mt-2">
				<Button type="submit" text="Send" color="bg-confirm" />
			</div>
		</form>
	{:else}
		<form
			method="post"
			action="?/search"
			class="mt-4"
			use:enhance={() => {
				return async ({ result }) => {
					applyAction(result);
					if (search !== form?.search) {
						items = [];
						page = 0;
					}
					if (result.data && result.data.data) items = items.concat(result.data.data);
					page++;
				};
			}}
		>
			<input value={page} name="page" type="hidden" class="bg-black" />
			<Input
				bind:value={search}
				placeholder="Search..."
				name="search"
				error={searchInvalid && 'Must not be empty'}
				onchange={() => {
					page = 0;
				}}
			/>
			{#if items.length}
				{#each items ?? [] as item}
					<Item {item} onclick={() => (selectedItem = item)} />
				{/each}
				<Button text="Load more" type="submit" />
			{/if}
		</form>
	{/if}
	{#each messages as message}
		{#if message}
			<div class="mb-2 flex">
				<a href="/profile/{users?.get(message.sent_by)?.username}">
					<img
						src={users?.get(message.sent_by)?.profile_pic || '/icon.png'}
						class="hover:cursor mr-2 mt-2 aspect-square w-12 rounded-full object-cover"
						alt=""
					/>
				</a>
				<div class="w-full">
					<Item
						margin={false}
						item={message.item}
						onclick={() => {
							if (expandedItem === message.id) {
								expandedItem = null;
								message.is_new = false;
							} else expandedItem = message.id;
						}}
						roundedBottom={expandedItem !== message.id}
						messageIcon={message.message !== ''}
						newIcon={message.is_new}
					/>
					{#if expandedItem === message.id}
						<div class="bg-light-bg rounded-b-md p-1" transition:slide>
							<p class="text-sender-text">
								Sent by {users?.get(message.sent_by)?.display_name || '@' + message.sent_by}
							</p>
							<p class="text-light-text mb-2">
								{new Date(message.sent_at).toLocaleDateString()}
								{new Date(message.sent_at).toLocaleTimeString()}
							</p>

							{#if message.message}
								<p class="bg-fg mb-2 whitespace-break-spaces rounded-md p-2">
									{@html message.message}
								</p>
							{/if}
							<div class="mt-2 grid grid-cols-2">
								<div class="mb-1 ml-2 flex"></div>
								{#if users?.get(message.sent_by)?.username === ''}
									<form method="post" action="?/delete" use:enhance>
										<input type="hidden" name="message" value={expandedItem} />
										<Button text="Delete" type="submit" />
									</form>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	{/each}

	{#if loaded < messages.length}
		<Loader />
	{/if}
	<Tutorial title="Using chats">
		To send a song, search for it using the search bar at the top. Select one, optionally enter a
		message and hit <b>Send</b>.<br />
		In the list of messages you've received, click on the profile picture to go to the sender's profile,
		the message picture to go to the song on Spotify, or the rest of the message to expand it.<br />
	</Tutorial>
	{#if !group?.is_private}
		<Tutorial title="Invite people">
			You can invite people to your group by clicking on the symbol in the upper left.
		</Tutorial>
		<Tutorial title="Editing a group">
			Click on the purple bar at the top to change the group's name and picture and manage its
			members.
		</Tutorial>
	{/if}
{:else}
	<Loader />
{/if}
<Error error={error || form?.error} />
