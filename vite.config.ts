import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		https: {
			key: fs.readFileSync(`/etc/letsencrypt/live/mango.thein.nl/privkey.pem`),
			cert: fs.readFileSync(`/etc/letsencrypt/live/mango.thein.nl/cert.pem`)
		},
		proxy: {}
	}
});
