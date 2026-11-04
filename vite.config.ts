import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';
import { highlight } from './scripts/highlight.ts';
import { mdImages } from './scripts/md-images.ts';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			extensions: ['.svelte', '.md'],
			preprocess: [mdImages(), mdsvex({ extensions: ['.md'], highlight: { highlighter: highlight } })],
			adapter: adapter({ runtime: 'nodejs22.x' }),
			// Served under cabrera.systems/blog (stage 2 mounts it there).
			paths: { base: '/blog' },
			prerender: { handleHttpError: 'fail', handleUnseenRoutes: 'ignore' }
		})
	]
});
