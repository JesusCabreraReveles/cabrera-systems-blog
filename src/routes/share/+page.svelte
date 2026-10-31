<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatDate } from '#lib/i18n.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Share Kit</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="mx-auto max-w-3xl px-6 py-12">
	<p class="font-mono text-xs tracking-[0.3em] text-accent uppercase">// share kit</p>
	<h1 class="mt-3 font-headline text-4xl font-bold text-white">Posts</h1>
	<ul class="mt-10 divide-y divide-white/5">
		{#each data.posts as post (post.id)}
			<li>
				<a href={resolve(`share/${post.id}`)} class="group flex items-baseline justify-between gap-4 py-4">
					<span class="font-headline text-lg text-white group-hover:text-accent">{post.meta.title}</span>
					<time class="shrink-0 font-mono text-xs text-slate-500" datetime={post.meta.date}>
						{formatDate(post.meta.date, post.lang)}
					</time>
				</a>
			</li>
		{/each}
	</ul>
</main>
