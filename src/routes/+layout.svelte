<script lang="ts">
	import { browser } from '$app/environment';
	import { colors, themes } from '$lib/constants';
	import type { Theme } from '$lib/types';
	import '../app.css';

	if (browser) {
		const string = localStorage.getItem('theme-colors');
		const savedColors = string ? JSON.parse(string) : themes.default;

		for (const color of colors) {
			document.body.style.setProperty(
				'--' + color,
				savedColors[color] ?? themes.default[color as keyof Theme]
			);
		}
	}
</script>

<div class="max-w-96">
	<slot></slot>
</div>
