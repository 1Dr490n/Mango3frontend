<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '../../../lib/components/Button.svelte';
	import Error from '../../../lib/components/Error.svelte';
	import Input from '../../../lib/components/Input.svelte';
	import TextArea from '../../../lib/components/TextArea.svelte';
	import TopBar from '../../../lib/components/TopBar.svelte';
	import Tutorial from '../../../lib/components/Tutorial.svelte';

	export let data, form;

	let edit = false;

	let fileInput: HTMLInputElement | undefined = undefined;
	let image = data.data?.profile_pic;
	let formElement: HTMLFormElement;

	let messageForm: HTMLFormElement;

	const getBase64 = (file: File) => {
		const img = new Image();

		img.onload = () => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d')!;

			canvas.width = 128;
			canvas.height = 128;

			const ratio = 128 / (img.width < img.height ? img.width : img.height);

			ctx.drawImage(
				img,
				(img.width * ratio) / -2 + 64,
				(img.height * ratio) / -2 + 64,
				img.width * ratio,
				img.height * ratio
			);
			const dataUrl = canvas.toDataURL();

			image = dataUrl;
		};

		img.src = URL.createObjectURL(file);
	};
</script>

<input
	type="file"
	hidden
	bind:this={fileInput}
	on:change={() => fileInput?.files && getBase64(fileInput.files[0])}
/>
<TopBar>
	<div class="justify-start flex">
		<form method="post" action="?/message" use:enhance hidden bind:this={messageForm} />
		<button
			class="active:bg-fg flex justify-center items-center p-3 ml-1 rounded-full transition-colors aspect-square"
			on:click={() => {
				if (data.data?.username === data.username) {
					edit = !edit;
				} else {
					messageForm.submit();
				}
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				{#if data.data && data.data?.username === data.username}
					{#if edit}
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					{:else}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
						/>
					{/if}
				{:else}
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
					/>
				{/if}
			</svg>
		</button>
	</div>
</TopBar>
{#if data.data}
	{#if edit}
		<form
			method="post"
			action="?/save"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					edit = false;
				};
			}}
			bind:this={formElement}
		>
			<div class="flex">
				<div>
					<button
						on:click={() => {
							if (image) {
								image = '';
							} else {
								fileInput?.click();
							}
						}}
						type="button"
					>
						{#if image}
							<img
								src={image}
								class="rounded-full aspect-square size-20 mr-2 hover:cursor-pointer object-cover"
								alt="Click"
							/>
						{:else}
							<div
								class="rounded-full aspect-square size-20 mr-2 hover:cursor-pointer bg-yellow-100 text-black flex justify-center items-center"
							>
								Click here
							</div>
						{/if}
					</button>
				</div>
				<div class="text-xl">
					<Input
						placeholder="Display name"
						value={data.data.display_name || ''}
						name="displayname"
					/>
					<p class="text-light-text text-sm">@{data.data.username}</p>
				</div>
			</div>
			<div class="mt-2 mb-4">
				<TextArea placeholder="Biography" value={data.data.bio} name="bio" />
			</div>
			<Button
				text="Save"
				color="bg-confirm"
				onclick={async () => {
					/*const response = await API.post({
						resource: `/user/${data.username}/upload`,
						data: {
							data: image || ''
						},
						url: null
					});
					if (response.error) {
						data.error = response.error;
					} else {*/
					formElement.submit();
					//}
				}}
			/>
		</form>
	{:else}
		<div class="flex">
			<img
				src={data.data?.profile_pic || '/icon.png'}
				class="rounded-full aspect-square size-20 mr-2 object-cover"
				alt=""
			/>
			<div>
				<p class="text-text text-2xl">{data.data.display_name || ''}</p>
				<p class="text-light-text text-sm">@{data.data.username}</p>
				{#if data.data.username == 'luna'}
					<p class="bg-red-600 opacity-70 p-0.5 rounded-md text-xs w-fit">Admin</p>
				{/if}
			</div>
		</div>
		{#if data.data.bio}
			<p class="mt-2 bg-fg mb-1 w-full rounded-md p-1">
				{data.data.bio}
			</p>
		{/if}
	{/if}
	{#if data.data.username == data.username}
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
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
						/>
					</svg> in the upper left corner
				</li>
				<li>2. Change your display name, add a biography and add a profile picture</li>
				<li>3. Hit <b>Save</b></li>
			</ol>
		</Tutorial>
	{:else}
		<Tutorial title="Message this person">
			You can jump to your private chat with this person by clicking on the symbol in the upper
			left. If you don't have one yet, it will be created directly.
		</Tutorial>
	{/if}
{/if}
<Error error={data.error || form?.error} />
