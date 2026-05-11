<script lang="ts">
	import type { ItemDTO } from '../types';
	import Dot from './Dot.svelte';

	export let item: ItemDTO;
	export let onclick: (() => void) | undefined = undefined;
	export let margin: boolean = true;
	export let roundedBottom: boolean = true;

	export let messageIcon: boolean = false;
	export let newIcon: boolean = false;
	export let newReactionIcon: boolean = false;
	export let isFavoriteIcon: boolean = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="{margin ? 'mb-2' : ''} {roundedBottom
		? 'rounded-md'
		: 'rounded-t-md'} bg-light-bg flex p-1"
	on:click={onclick}
>
	<div>
		<a href={item.href}>
			<img
				src={item.image || '/icon.png'}
				class="mr-2 w-12 min-w-12 aspect-square rounded-lg"
				alt=""
			/>
		</a>
	</div>
	<div>
		<p class="">
			{item.name}
			<Dot color="message" visible={messageIcon} />
			<Dot color="new" visible={newIcon} />
			<Dot color="reaction" visible={newReactionIcon} />
			<Dot color="favorite" visible={isFavoriteIcon} />
		</p>
		<div class="flex">
			<p class="text-light-text mr-2 text-sm">{item.artist || '\xa0'}</p>
			<p class="bg-fg text-light-text rounded-lg pl-1 pr-1 align-middle text-xs">
				{item.type.toLowerCase()}
			</p>
		</div>
	</div>
</div>
