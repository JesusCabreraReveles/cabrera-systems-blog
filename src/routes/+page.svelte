<script lang="ts">
	import { resolve } from '$app/paths';
	import { site } from '#lib/content.ts';
	import { onMount } from 'svelte';

	// Static site: pick the index from the browser language on the client.
	onMount(() => {
		const lang = navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
		location.replace(resolve(lang));
	});
</script>

<svelte:head>
	<title>{site.title}</title>
	<link rel="alternate" hreflang="en" href="{site.baseUrl}/en" />
	<link rel="alternate" hreflang="es" href="{site.baseUrl}/es" />
	<link rel="alternate" hreflang="x-default" href={site.baseUrl} />
	<script>
		const lang = navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
		location.replace('/blog/' + lang + '/');
	</script>
</svelte:head>

<main class="grid min-h-dvh place-items-center font-mono text-sm bg-ink-950 text-slate-400">
	<p>
		<a class="hover:text-accent transition-colors" href={resolve('en')}>English</a>
		<span class="px-2 text-slate-600">|</span>
		<a class="hover:text-accent transition-colors" href={resolve('es')}>Español</a>
	</p>
</main>
