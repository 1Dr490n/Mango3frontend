<script lang="ts">
	import { slide } from 'svelte/transition';

	export let menu = true;
	let expanded = false;

	const options = [
		['Profile', '/profile'],
		['Settings', '/settings'],
		['Log out', '/logout']
	];
</script>

<div class="grid grid-cols-3 items-center mb-4">
	<div>
		<slot />
	</div>
	<a class="flex justify-center items-center" href="/">
		<div class="w-12 mr-3">
			<img src="/icon.png" alt="" />
		</div>
		<p class="text-xl font-[calibri] text-text decoration-text">Mango</p>
	</a>
	{#if menu}
		<div class="justify-end flex">
			<div
				class="hover:cursor-pointer active:bg-fg flex justify-center items-center p-3 mr-1 rounded-full transition-colors aspect-square"
				on:click={() => (expanded = !expanded)}
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
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</div>
		</div>
	{/if}
</div>
{#if expanded && menu}
	<div transition:slide class="ml-8 mb-4">
		<ul>
			{#each options as option}
				<li class="mb-2">
					<a href={option[1]} class="text-text">{option[0]}</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}
