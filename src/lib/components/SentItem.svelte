<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { MessageDTO, UserDTO } from '../types';
	import Item from './Item.svelte';
	import Button from './Button.svelte';
	import { API } from '../api';

	export let message: MessageDTO;
	export let onclick: () => void;
	export let expanded;
	export let reactions: string[];
	export let audio: HTMLAudioElement | null;
	export let sentBy: UserDTO | undefined | null;
	export let username: string | undefined;
</script>

<div class="mb-2 flex">
	<a href="profile/{sentBy?.username}">
		<img
			src={sentBy?.profile_pic || '/icon.png'}
			class="hover:cursor mr-2 mt-2 h-8 w-8 rounded-full object-cover"
			alt=""
		/>
	</a>
	<div class="w-full">
		<Item
			margin={false}
			item={message.item}
			{onclick}
			roundedBottom={!expanded}
			messageIcon={message.message !== ''}
			{...{
				/*
				newIcon={message.isNew && message.sentBy.name !== name}
				newReactionIcon={message.hasNewReaction}
			isFavoriteIcon={message.sentBy.favorites.some((x) => x.id == message.item.id)}
				*/
			}}
		/>
		{#if expanded}
			<div class="bg-light-bg rounded-b-md p-1" transition:slide>
				<p class="text-sender-text">Sent by {sentBy?.display_name || sentBy?.username}</p>
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
					{#if sentBy?.username === username}
						<Button
							text="Delete"
							onclick={() => {
								if (window.confirm('This item will be deleted for everyone you sent it to.')) {
									const res = API.delete(
										{
											resource: `/message/${message.id}`,
											auth: true
										},
										cook
									);
								}
							}}
						/>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
