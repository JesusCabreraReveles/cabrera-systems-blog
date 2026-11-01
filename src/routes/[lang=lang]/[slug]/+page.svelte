<script lang="ts">
	import { resolve } from '$app/paths';
	import AudioPlayer from '#lib/components/AudioPlayer.svelte';
	import { absoluteAsset, absoluteUrl, site } from '#lib/content.ts';
	import { formatDate, otherLang, ui } from '#lib/i18n.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let { post, Body } = $derived(data);
	let t = $derived(ui[post.lang]);
	let other = $derived(otherLang(post.lang));
	let canonical = $derived(absoluteUrl(post.alternates[post.lang]));
	// schema.org data so search engines read the post as an article by the author.
	let jsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			headline: post.meta.title,
			description: post.meta.description,
			image: absoluteAsset(post.coverUrl),
			datePublished: post.meta.date,
			inLanguage: post.lang,
			url: canonical,
			mainEntityOfPage: canonical,
			keywords: post.meta.hashtags.join(', '),
			author: { '@type': 'Person', name: site.author.name, url: site.author.url },
			isPartOf: { '@type': 'Blog', name: site.title, url: absoluteUrl(post.lang) }
		}).replace(/</g, '\\u003c')
	);
	const tagLabel = (id: string) => site.tags.find((tag) => tag.id === id)?.label[post.lang] ?? id;
</script>

<svelte:head>
	<title>{post.meta.title} · {site.title}</title>
	<meta name="description" content={post.meta.description} />
	<link rel="canonical" href={canonical} />
	{#each Object.entries(post.alternates) as [lang, path] (lang)}
		<link rel="alternate" hreflang={lang} href={absoluteUrl(path)} />
	{/each}
	<link rel="alternate" type="application/rss+xml" title={site.title} href={absoluteUrl(`${post.lang}/rss.xml`)} />

	<meta property="og:type" content="article" />
	<meta property="og:site_name" content={site.title} />
	<meta property="og:locale" content={t.locale} />
	<meta property="og:title" content={post.meta.title} />
	<meta property="og:description" content={post.meta.description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={absoluteUrl(`og/${post.id}.jpg`)} />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={post.meta.coverAlt} />
	<meta property="article:published_time" content={post.meta.date} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@{site.social.x}" />
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<div class="relative border-b border-white/5 bg-ink-900">
	<div class="grid-overlay pointer-events-none absolute inset-0 opacity-60"></div>
	<nav
		class="relative mx-auto flex max-w-3xl items-center justify-between px-6 py-6 font-mono text-xs tracking-[0.2em] uppercase"
	>
		<a href={resolve(post.lang)} class="text-accent hover:text-white">← {t.back}</a>
		{#if post.alternates[other]}
			<a
				href={resolve(post.alternates[other]!)}
				hreflang={other}
				aria-label={t.readIn}
				class="rounded border border-white/10 px-2.5 py-1 text-slate-400 transition-colors hover:border-accent hover:text-white"
			>
				<span class={post.lang === 'en' ? 'text-white' : ''}>EN</span>
				<span class="px-1 text-slate-600">|</span>
				<span class={post.lang === 'es' ? 'text-white' : ''}>ES</span>
			</a>
		{/if}
	</nav>
</div>

<main class="mx-auto max-w-3xl px-6 pt-14 pb-24">
	<header>
		<p class="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-slate-500">
			<time datetime={post.meta.date}>{formatDate(post.meta.date, post.lang)}</time>
			{#each post.meta.tags as tag (tag)}
				<a href={resolve(post.lang)} class="hover:text-accent">#{tagLabel(tag)}</a>
			{/each}
		</p>
		<h1 class="mt-4 font-headline text-4xl leading-tight font-bold tracking-tight text-white md:text-5xl">
			{post.meta.title}
		</h1>
		<p class="mt-5 text-xl leading-relaxed text-slate-400">{post.meta.description}</p>
	</header>

	<img
		src={post.coverUrl}
		alt={post.meta.coverAlt}
		width="1200"
		height="630"
		class="mt-10 aspect-[1200/630] w-full rounded-lg border border-white/5 object-cover"
	/>

	{#if post.audio && post.meta.duration && post.meta.audioLang}
		<div class="mt-10">
			<AudioPlayer
				src={post.audio.url}
				duration={post.meta.duration}
				lang={post.lang}
				audioLang={post.meta.audioLang}
				transcript={post.audio.transcript}
			/>
		</div>
	{/if}

	<article class="prose prose-lg prose-blog prose-blog-code mt-12 max-w-none prose-headings:font-headline">
		<Body />
	</article>

	{#if post.meta.sourceUrls.length}
		<!-- Sources the post was written from (listed by the agent). -->
		<section class="mt-16 border-t border-white/5 pt-8">
			<h2 class="font-mono text-xs tracking-[0.3em] text-accent uppercase">
				// {t.sources}
			</h2>
			<ul class="mt-4 space-y-2 text-sm">
				{#each post.meta.sourceUrls as url (url)}
					<li><a href={url} class="break-all text-slate-400 hover:text-accent">{url}</a></li>
				{/each}
			</ul>
		</section>
	{/if}
</main>
