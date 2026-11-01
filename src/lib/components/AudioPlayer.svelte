<script lang="ts">
	import { formatDuration, ui } from '#lib/i18n.ts';
	import type { Lang } from '#lib/schema/post.ts';

	let {
		src,
		duration,
		lang,
		audioLang,
		transcript
	}: { src: string; duration: number; lang: Lang; audioLang: Lang; transcript: string } = $props();

	let t = $derived(ui[lang]);
	// Transcript is plain text from whisper, split into paragraphs on blank lines.
	let paragraphs = $derived(transcript.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean));
</script>

<section class="rounded-lg border border-white/10 bg-ink-850 p-4">
	<p class="flex flex-wrap items-baseline gap-x-3 font-mono text-xs tracking-[0.2em] text-accent uppercase">
		<span>// {t.listen}</span>
		<span class="tracking-normal text-slate-500 normal-case">
			{formatDuration(duration)}{#if audioLang !== lang} · {t.audioIn}{/if}
		</span>
	</p>
	<audio controls preload="none" {src} class="mt-3 w-full [color-scheme:dark]"></audio>

	<details class="group mt-3">
		<summary class="cursor-pointer list-none font-mono [&::-webkit-details-marker]:hidden text-xs text-slate-400 select-none hover:text-white">
			<span class="inline-block transition-transform group-open:rotate-90">›</span>
			{t.transcript}
		</summary>
		<div lang={audioLang} class="mt-3 max-h-96 space-y-3 overflow-auto pr-2 text-sm leading-relaxed text-slate-400">
			{#each paragraphs as paragraph, i (i)}
				<p>{paragraph}</p>
			{/each}
		</div>
	</details>
</section>
