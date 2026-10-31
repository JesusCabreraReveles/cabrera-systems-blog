<script lang="ts">
	let { text, html, label = 'Copy' }: { text: string; html?: () => string; label?: string } = $props();
	let copied = $state(false);

	async function copy() {
		if (html) {
			// Rich copy (Medium keeps headings, links and images).
			await navigator.clipboard.write([
				new ClipboardItem({
					'text/html': new Blob([html()], { type: 'text/html' }),
					'text/plain': new Blob([text], { type: 'text/plain' })
				})
			]);
		} else {
			await navigator.clipboard.writeText(text);
		}
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<button
	type="button"
	onclick={copy}
	class="rounded border border-white/15 px-3 py-1.5 font-mono text-xs text-slate-300 transition-colors hover:border-accent hover:text-white"
>
	{copied ? '✓ Copied' : label}
</button>
