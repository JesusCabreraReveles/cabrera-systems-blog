<script lang="ts">
	import { resolve } from '$app/paths';
	import CopyButton from '#lib/components/CopyButton.svelte';
	import { absoluteAsset } from '#lib/content.ts';
	import { canonicalUrl, devtoMarkdown, linkedinText, X_LIMIT, xLength, xText } from '#lib/share.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Rendered bodies, used for Medium's rich-text copy.
	let bodies: Record<string, HTMLElement> = $state({});

	function mediumHtml(lang: string, title: string, coverUrl: string, coverAlt: string, url: string) {
		const body = bodies[lang].cloneNode(true) as HTMLElement;
		for (const img of body.querySelectorAll('img')) img.src = absoluteAsset(img.getAttribute('src')!);
		const footer = lang === 'es' ? 'Publicado originalmente en' : 'Originally published at';
		return `<h1>${title}</h1><img src="${absoluteAsset(coverUrl)}" alt="${coverAlt}">${body.innerHTML}<p><em>${footer} <a href="${url}">${url}</a></em></p>`;
	}
</script>

<svelte:head>
	<title>Share Kit · {data.versions[0].post.meta.title}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="mx-auto max-w-5xl px-6 py-12">
	<a href={resolve('share')} class="font-mono text-xs tracking-[0.3em] text-accent uppercase">← share kit</a>
	<p class="mt-6 font-mono text-xs text-slate-500">{data.id}</p>

	<div class="mt-8 grid gap-10 lg:grid-cols-2">
		{#each data.versions as { post, Body } (post.lang)}
			{@const url = canonicalUrl(post)}
			{@const x = xText(post)}
			<section class="space-y-6">
				<header>
					<p class="font-mono text-xs text-slate-500 uppercase">
						{post.lang} · {post.meta.original ? 'original' : 'adaptation'}
					</p>
					<h1 class="mt-2 font-headline text-2xl font-bold text-white">{post.meta.title}</h1>
					<a href={resolve(post.alternates[post.lang]!)} class="mt-1 block break-all text-sm text-accent">{url}</a>
				</header>

				{#snippet card(title: string)}
					<h2 class="font-mono text-xs tracking-[0.2em] text-slate-400 uppercase">{title}</h2>
				{/snippet}

				<div class="space-y-3 rounded-lg border border-white/10 bg-ink-850 p-4">
					{@render card('Link')}
					<div class="flex flex-wrap gap-2">
						<CopyButton text={url} label="Copy URL" />
						<a href={post.coverUrl} download="cover-{post.id}.webp" class="rounded border border-white/15 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-accent hover:text-white">
							Download cover
						</a>
					</div>
				</div>

				<div class="space-y-3 rounded-lg border border-white/10 bg-ink-850 p-4">
					{@render card('LinkedIn')}
					<pre class="max-h-60 overflow-auto font-sans text-sm whitespace-pre-wrap text-slate-300">{linkedinText(post)}</pre>
					<CopyButton text={linkedinText(post)} />
				</div>

				<div class="space-y-3 rounded-lg border border-white/10 bg-ink-850 p-4">
					{@render card('X · @TalkingWMy')}
					<pre class="font-sans text-sm whitespace-pre-wrap text-slate-300">{x}</pre>
					<div class="flex flex-wrap items-center gap-2">
						<CopyButton text={x} />
						<a href="https://x.com/intent/post?text={encodeURIComponent(x)}" target="_blank" rel="noopener" class="rounded border border-white/15 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-accent hover:text-white">
							Open in X
						</a>
						<span class="font-mono text-xs {xLength(x) > X_LIMIT ? 'text-rose-400' : 'text-slate-500'}">
							{xLength(x)}/{X_LIMIT}
						</span>
					</div>
				</div>

				<div class="space-y-3 rounded-lg border border-white/10 bg-ink-850 p-4">
					{@render card('Medium')}
					<p class="text-sm text-slate-400">
						Best: <em>Import a story</em> with the URL (sets the canonical link). Fallback: paste the rich text.
					</p>
					<div class="flex flex-wrap gap-2">
						<CopyButton text={url} label="Copy URL" />
						<a href="https://medium.com/p/import" target="_blank" rel="noopener" class="rounded border border-white/15 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-accent hover:text-white">
							Import a story
						</a>
						<CopyButton
							text={post.body}
							html={() => mediumHtml(post.lang, post.meta.title, post.coverUrl, post.meta.coverAlt, url)}
							label="Copy rich text"
						/>
					</div>
					<div class="hidden" bind:this={bodies[post.lang]}><Body /></div>
				</div>

				<div class="space-y-3 rounded-lg border border-white/10 bg-ink-850 p-4">
					{@render card('dev.to · Hashnode')}
					<pre class="max-h-60 overflow-auto rounded bg-ink-900 p-3 font-mono text-xs whitespace-pre-wrap text-slate-300">{devtoMarkdown(post)}</pre>
					<div class="flex flex-wrap gap-2">
						<CopyButton text={devtoMarkdown(post)} />
						<a href="https://dev.to/new" target="_blank" rel="noopener" class="rounded border border-white/15 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-accent hover:text-white">
							Open dev.to
						</a>
					</div>
				</div>
			</section>
		{/each}
	</div>
</main>
