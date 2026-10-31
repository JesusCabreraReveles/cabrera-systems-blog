<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { site } from '#lib/content.ts';
	import { MediaQuery } from 'svelte/reactivity';

	// Bilingual on purpose: a broken URL doesn't tell us the reader's language.
	let status = $derived(String(page.status));
	let spanishFirst = $derived(page.params.lang !== 'en');
	let lines = $derived({
		es: page.status === 404 ? 'Esta idea todavía no la he tenido.' : 'Algo se rompió mientras pensaba.',
		en: page.status === 404 ? "I haven't had this thought yet." : 'Something broke while I was thinking.'
	});
	const reducedMotion = new MediaQuery('prefers-reduced-motion: reduce');
	let order = $derived(spanishFirst ? (['es', 'en'] as const) : (['en', 'es'] as const));
</script>

<svelte:head>
	<title>{status} · {site.title}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="relative grid min-h-dvh place-items-center overflow-hidden bg-ink-950 px-6">
	<!-- Grid that warps around the number (SVG turbulence + displacement). -->
	<svg class="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
		<defs>
			<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
				<path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f97316" stroke-opacity="0.16" stroke-width="1" />
			</pattern>
			<filter id="warp" x="-10%" y="-10%" width="120%" height="120%">
				<feTurbulence type="fractalNoise" baseFrequency="0.006 0.01" numOctaves="2" seed="4">
					{#if !reducedMotion.current}
						<animate
							attributeName="baseFrequency"
							dur="14s"
							values="0.006 0.01;0.009 0.006;0.006 0.01"
							repeatCount="indefinite"
						/>
					{/if}
				</feTurbulence>
				<feDisplacementMap in="SourceGraphic" scale="60" />
			</filter>
			<radialGradient id="fade">
				<stop offset="0%" stop-color="#fff" stop-opacity="1" />
				<stop offset="100%" stop-color="#fff" stop-opacity="0" />
			</radialGradient>
			<mask id="vignette"><rect width="100%" height="100%" fill="url(#fade)" /></mask>
		</defs>
		<rect width="100%" height="100%" fill="url(#grid)" filter="url(#warp)" mask="url(#vignette)" />
	</svg>

	<div class="relative text-center">
		<h1
			class="glitch font-headline text-[34vw] leading-none font-bold tracking-tighter text-white sm:text-[16rem]"
			data-text={status}
		>
			{status}
		</h1>

		<div class="mt-6 space-y-2 font-mono text-sm text-slate-300 sm:text-base">
			{#each order as lang (lang)}
				<p lang={lang}><span class="text-accent">&gt;</span> {lines[lang]}</p>
			{/each}
			<p aria-hidden="true"><span class="cursor text-accent">_</span></p>
		</div>

		<nav class="mt-10 flex flex-col items-center justify-center gap-3 font-mono sm:flex-row text-xs tracking-[0.2em] uppercase">
			{#each order as lang (lang)}
				<a
					href={resolve(lang)}
					hreflang={lang}
					class="rounded border border-white/15 px-4 py-2 whitespace-nowrap text-slate-300 transition-colors hover:border-accent hover:text-white"
				>
					[ {lang === 'es' ? 'Ir al blog' : 'Go to the blog'} ]
				</a>
			{/each}
		</nav>
	</div>
</main>

<style>
	/* Two offset copies of the number, sliced and shifted in short bursts. */
	.glitch {
		position: relative;
		text-shadow: 0 0 40px rgb(249 115 22 / 0.25);
	}
	.glitch::before,
	.glitch::after {
		content: attr(data-text);
		position: absolute;
		inset: 0;
		background: var(--color-ink-950);
		clip-path: inset(100% 0 0 0);
	}
	.glitch::before {
		color: var(--color-accent);
		text-shadow: -3px 0 #f97316;
		animation: slice-a 4.2s steps(1) infinite;
	}
	.glitch::after {
		color: #06b6d4;
		text-shadow: 3px 0 #06b6d4;
		animation: slice-b 4.2s steps(1) infinite;
	}

	@keyframes slice-a {
		0%, 82%, 100% { clip-path: inset(100% 0 0 0); transform: none; }
		83% { clip-path: inset(12% 0 70% 0); transform: translate(-14px, 0); }
		86% { clip-path: inset(48% 0 30% 0); transform: translate(18px, 0); }
		89% { clip-path: inset(70% 0 8% 0); transform: translate(-8px, 0); }
		92% { clip-path: inset(30% 0 55% 0); transform: translate(10px, 0); }
		95% { clip-path: inset(100% 0 0 0); transform: none; }
	}
	@keyframes slice-b {
		0%, 83%, 100% { clip-path: inset(100% 0 0 0); transform: none; }
		84% { clip-path: inset(60% 0 22% 0); transform: translate(16px, 0); }
		87% { clip-path: inset(20% 0 62% 0); transform: translate(-20px, 0); }
		90% { clip-path: inset(80% 0 4% 0); transform: translate(6px, 0); }
		93% { clip-path: inset(40% 0 40% 0); transform: translate(-12px, 0); }
		96% { clip-path: inset(100% 0 0 0); transform: none; }
	}

	.cursor {
		animation: blink 1s steps(1) infinite;
	}
	@keyframes blink {
		50% { opacity: 0; }
	}

	@media (prefers-reduced-motion: reduce) {
		.glitch::before,
		.glitch::after,
		.cursor {
			animation: none;
		}
	}
</style>
