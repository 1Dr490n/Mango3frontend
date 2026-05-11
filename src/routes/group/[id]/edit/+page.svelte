<script lang="ts">
	import { enhance } from '$app/forms';
	import { API } from '../../../../lib/api';
	import Button from '../../../../lib/components/Button.svelte';
	import Input from '../../../../lib/components/Input.svelte';
	import Error from '../../../../lib/components/Error.svelte';
	import TopBar from '../../../../lib/components/TopBar.svelte';

	export let data, form;

	let fileInput: HTMLInputElement | undefined = undefined;
	let image = data.data?.picture;
	let formElement: HTMLFormElement;

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
<TopBar />
{#if data.data}
	<form method="post" action="?/save" use:enhance bind:this={formElement}>
		<div class="flex mb-4">
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
				<Input placeholder="Name" value={data.data.name || ''} name="name" />
			</div>
		</div>
		<Button
			text="Save"
			color="bg-confirm"
			onclick={async () => {
				const response = await API.post({
					resource: `/user/${data.username}/upload`,
					data: {
						data: image || ''
					},
					url: null
				});
				if (response.error) {
					data.error = response.error;
				} else {
					formElement.submit();
				}
			}}
		/>
		<div class="mt-60">
			<Button formaction="?/leave" text="Leave" color="bg-red-500" type="submit"></Button>
		</div>
	</form>
{/if}
<Error error={data.error || form?.error} />
