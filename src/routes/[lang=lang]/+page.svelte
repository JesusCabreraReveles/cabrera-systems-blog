<script lang="ts">
	import { resolve } from '$app/paths';
	import { site } from '#lib/content.ts';
	import { formatDate, formatDuration, otherLang, ui } from '#lib/i18n.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let t = $derived(ui[data.lang]);
	let [latest, ...earlier] = $derived(data.posts);
	const tagLabel = (id: string) => site.tags.find((tag) => tag.id === id)?.label[data.lang] ?? id;
	const href = (slug: string) => resolve(`${data.lang}/${slug}`);
</script>

<svelte:head>
	<title>{site.title}</title>
	<meta name="description" content={site.tagline[data.lang]} />
	<link rel="canonical" href="{site.baseUrl}/{data.lang}" />
	{#each site.languages as lang (lang)}
		<link rel="alternate" hreflang={lang} href="{site.baseUrl}/{lang}" />
	{/each}
	<link rel="alternate" type="application/rss+xml" title={site.title} href="{site.baseUrl}/{data.lang}/rss.xml" />
</svelte:head>

<!-- Hero -->
<header class="relative overflow-hidden border-b border-white/5 bg-ink-900">
	<div class="grid-overlay pointer-events-none absolute inset-0 opacity-60"></div>
	<div
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_-10%,rgba(249,115,22,0.14),transparent_70%)]"
	></div>
	<div class="relative mx-auto max-w-3xl px-6 pt-10 pb-20 md:pt-14 md:pb-28">
		<nav class="mb-16 flex items-center justify-between font-mono text-xs tracking-[0.2em] uppercase">
			<a href={resolve(data.lang)} class="text-accent">// blog</a>
			<a
				href={resolve(otherLang(data.lang))}
				hreflang={otherLang(data.lang)}
				class="rounded border border-white/10 px-2.5 py-1 text-slate-400 transition-colors hover:border-accent hover:text-white"
				aria-label={t.readIn}
			>
				<span class={data.lang === 'en' ? 'text-white' : ''}>EN</span>
				<span class="px-1 text-slate-600">|</span>
				<span class={data.lang === 'es' ? 'text-white' : ''}>ES</span>
			</a>
		</nav>
		<h1 class="font-headline text-5xl font-bold tracking-tighter text-white md:text-7xl">
			{site.title}
		</h1>
		<p class="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">{site.tagline[data.lang]}</p>
	</div>
</header>

<!-- Links -->
<nav class="border-b border-white/5 bg-ink-850">
	<ul class="mx-auto flex max-w-3xl flex-wrap gap-2 px-6 py-5 font-mono text-xs">
		{#each site.links as link (link.id)}
			<li>
				<a
					href={link.url}
					class="block rounded border border-white/10 px-3 py-1.5 text-slate-400 transition-colors hover:border-accent hover:text-white"
				>
					{link.label[data.lang]}
				</a>
			</li>
		{/each}
		<li>
			<a
				href={resolve(`${data.lang}/rss.xml`)}
				class="block rounded border border-white/10 px-3 py-1.5 text-slate-400 transition-colors hover:border-accent hover:text-white"
			>
				RSS
			</a>
		</li>
	</ul>
</nav>

<!-- Posts -->
<main class="mx-auto max-w-3xl px-6 py-16">
	{#if !latest}
		<p class="font-mono text-sm text-slate-500">{t.empty}</p>
	{:else}
		<p class="mb-6 font-mono text-xs tracking-[0.3em] text-accent uppercase">// {t.latest}</p>
		<a href={href(latest.meta.slug)} class="group block">
			<article>
				<img
					src={latest.coverUrl}
					alt={latest.meta.coverAlt}
					width="1200"
					height="630"
					class="aspect-[1200/630] w-full rounded-lg border border-white/5 object-cover"
				/>
				<h2
					class="mt-6 font-headline text-3xl font-bold tracking-tight text-white transition-colors group-hover:text-accent md:text-4xl"
				>
					{latest.meta.title}
				</h2>
				<p class="mt-3 text-lg leading-relaxed text-slate-400">{latest.meta.description}</p>
				{@render meta(latest)}
			</article>
		</a>

		{#if earlier.length}
			<p class="mt-20 mb-2 font-mono text-xs tracking-[0.3em] text-accent uppercase">
				// {t.archive}
			</p>
			<ul class="divide-y divide-white/5">
				{#each earlier as post (post.id)}
					<li>
						<a href={href(post.meta.slug)} class="group flex gap-5 py-6">
							<img
								src={post.coverUrl}
								alt=""
								width="120"
								height="63"
								loading="lazy"
								class="hidden aspect-[1200/630] w-32 shrink-0 rounded border border-white/5 object-cover sm:block"
							/>
							<div class="min-w-0">
								<h3
									class="font-headline text-xl font-semibold text-white transition-colors group-hover:text-accent"
								>
									{post.meta.title}
								</h3>
								<p class="mt-1 line-clamp-2 text-slate-400">{post.meta.description}</p>
								{@render meta(post)}
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</main>

{#snippet meta(post: (typeof data.posts)[number])}
	<p class="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-slate-500">
		{#if post.meta.duration}
			<span class="text-accent">▶ {formatDuration(post.meta.duration)}</span>
		{/if}
		<time datetime={post.meta.date}>{formatDate(post.meta.date, data.lang)}</time>
		{#each post.meta.tags as tag (tag)}
			<span>#{tagLabel(tag)}</span>
		{/each}
	</p>
{/snippet}
