/** @type {import('tailwindcss').Config} */

import { colors } from './src/lib/constants';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: colors.reduce((a, v) => ({ ...a, [v]: `var(--${v})` }))
		}
	}
};
