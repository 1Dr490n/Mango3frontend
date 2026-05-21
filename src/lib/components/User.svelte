<script lang="ts">
	import type { UserDTO } from '../types';

	export let user: UserDTO;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="flex hover:cursor-pointer items-center"
	on:click={() => {
		location.href = `/profile/${user.username}`;
	}}
>
	<!-- svelte-ignore a11y-missing-attribute -->
	<img
		src={user.profile_pic || '/icon.png'}
		class="m-1 aspect-square min-w-14 w-14 rounded-full object-cover"
	/>
	<p class="text-md ml-2">{user.display_name}</p>
</div>
