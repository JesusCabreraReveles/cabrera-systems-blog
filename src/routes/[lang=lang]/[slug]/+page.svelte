<script lang="ts">
	import { resolve } from '$app/paths';
	import { site } from '#lib/content.ts';
	import { formatDate, otherLang, ui } from '#lib/i18n.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let { post, Body } = $derived(data);
	let other = $derived(otherLang(post.lang));
</script>

<svelte:head>
	<title>{post.meta.title} · {site.title}</title>
	<meta name="description" content={post.meta.description} />
	<link rel="canonical" href="{site.baseUrl}/{post.alternates[post.lang]}" />
	{#each Object.entries(post.alternates) as [lang, path] (lang)}
		<link rel="alternate" hreflang={lang} href="{site.baseUrl}/{path}" />
	{/each}
</svelte:head>

<!-- Placeholder: full post layout (audio, transcript, OG) comes next. -->
<main class="mx-auto max-w-3xl px-6 py-12">
	<nav class="mb-12 flex justify-between font-mono text-xs tracking-[0.2em] uppercase">
		<a href={resolve(post.lang)} class="text-accent">← {site.title}</a>
		{#if post.alternates[other]}
			<a href={resolve(post.alternates[other]!)} hreflang={other}>{ui[post.lang].readIn}</a>
		{/if}
	</nav>
	<img src={post.coverUrl} alt={post.meta.coverAlt} class="w-full rounded-lg" />
	<h1 class="mt-8 font-headline text-4xl font-bold text-white">{post.meta.title}</h1>
	<time class="mt-2 block font-mono text-xs text-slate-500" datetime={post.meta.date}>
		{formatDate(post.meta.date, post.lang)}
	</time>
	<article class="mt-10 leading-relaxed"><Body /></article>
</main>
