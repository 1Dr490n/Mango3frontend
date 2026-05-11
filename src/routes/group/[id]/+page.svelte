<script lang="ts">
	import Group from '../../../lib/components/Group.svelte';
	import TopBar from '../../../lib/components/TopBar.svelte';
	import Error from '../../../lib/components/Error.svelte';
	import Input from '../../../lib/components/Input.svelte';
	import Item from '../../../lib/components/Item.svelte';
	import Button from '../../../lib/components/Button.svelte';
	import type { ItemDTO, MessageDTO, UserDTO } from '../../../lib/types';
	import { applyAction, enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import Tutorial from '../../../lib/components/Tutorial.svelte';

	export let data;
	export let form;
	let search: string | null = form?.search || null;
	let searchInvalid: boolean = form?.searchInvalid || false;
	$: searchInvalid = search !== null && !search;

	let messages: (MessageDTO & { sentBy: UserDTO | undefined })[];
	$: messages =
		data.messages?.map((x) => {
			return {
				...x,
				sentBy: data.group?.users?.find((y) => y.username === x.sent_by) || undefined
			};
		}) ?? [];

	let items: ItemDTO[] = [];
	let page = 0;

	let audio: HTMLAudioElement | null = null;

	let selectedItem: ItemDTO | null = null;

	let expandedItem: number | null = null;
</script>

<TopBar>
	{#if data.group?.name}
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
{#if data.group}
	<Group
		group={data.group}
		onclick={(otherUser) => {
			if (otherUser) goto(`/profile/${otherUser.username}`);
			else goto(`/group/${data.group?.id}/edit`);
		}}
		username={data.username || ''}
	/>
{/if}
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
		{#if data.group}
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
		{/if}
		{#if items.length}
			{#each items ?? [] as item}
				<Item {item} onclick={() => (selectedItem = item)} />
			{/each}
			<Button text="Load more" type="submit" />
		{/if}
	</form>
{/if}
<Error error={data.error || form?.error} />
{#each messages as message}
	<div class="mb-2 flex">
		<a href="/profile/{message.sentBy?.username}">
			<img
				src={message.sentBy?.profile_pic || '/icon.png'}
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
				{...{
					/*
				newReactionIcon={message.hasNewReaction}
			isFavoriteIcon={message.sentBy.favorites.some((x) => x.id == message.item.id)}
				*/
				}}
			/>
			{#if expandedItem === message.id}
				<div class="bg-light-bg rounded-b-md p-1" transition:slide>
					<p class="text-sender-text">
						Sent by {message.sentBy?.display_name || message.sentBy?.username}
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

					<!--div class="grid auto-cols-max grid-flow-col">
					<div>
						{#each message.sentTo as user}
							<User user={user.user} {groupId} />
						{/each}
					</div>
					<div>
						{#each message.sentTo as user}
							{#if user.user.name === name}
								<select
									class="bg-fg my-1 ml-4 rounded-md p-1 text-sm"
									bind:value={user.reaction}
									on:change={() => {
										socket.send(
											JSON.stringify({
												messageType: 'react',
												string: user.reaction,
												number: message.number
											})
										);
									}}
								>
									<option />
									{#each name === 'Ole Bela' ? reactions.filter((x) => x[0] !== '0') : reactions.map( (x) => (x[0] === '0' ? x.slice(1) : x) ) as reaction}
										<option>{reaction}</option>
									{/each}
								</select>
							{:else if user.reaction}
								<p class="bg-fg my-1 ml-4 rounded-md p-1 text-sm">{user.reaction}</p>
							{:else}
								<p class="my-1 ml-4 rounded-md p-1 text-sm">&nbsp;</p>
							{/if}
						{/each}
					</div>
				</div-->
					<div class="mt-2 grid grid-cols-2">
						<div class="mb-1 ml-2 flex">
							<!--{#if message.item.preview}
							<button
								on:click={() => {
									if (audio) {
										audio?.pause();
										audio = null;
									} else if (message.item.preview) {
										audio = new Audio(message.item.preview);
										audio.play();
									}
								}}
								class="bg-fg flex size-8 items-center justify-center rounded-full"
							>
								{#if audio}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="stroke-text size-6"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M15.75 5.25v13.5m-7.5-13.5v13.5"
										/>
									</svg>
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="stroke-text ml-1 size-6"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
										/>
									</svg>
								{/if}
							</button>
						{/if}-->
						</div>
						{#if message.sentBy?.username === data.username}
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
{/each}
<Tutorial title="Using chats">
	To send a song, search for it using the search bar at the top. Select one, optionally enter a
	message and hit <b>Send</b>.<br />
	In the list of messages you've received, click on the profile picture to go to the sender's profile,
	the message picture to go to the song on Spotify, or the rest of the message to expand it.<br />
</Tutorial>
{#if data.group?.name}
	<Tutorial title="Invite people">
		You can invite people to your group by clicking on the symbol in the upper left.
	</Tutorial>
	<Tutorial title="Editing a group">
		Click on the purple bar at the top to change the group's name and picture and manage its
		members.
	</Tutorial>
{/if}
