// Code highlighting for mdsvex, at build time (no JS shipped to readers).
import { createHighlighter } from 'shiki';

const THEME = 'github-dark-default';
// Languages likely in posts; anything else renders as plain text instead of failing the build.
const LANGS = ['bash', 'css', 'diff', 'dockerfile', 'go', 'html', 'js', 'json', 'markdown', 'python', 'sql', 'svelte', 'toml', 'ts', 'yaml'];

const highlighter = await createHighlighter({ themes: [THEME], langs: LANGS });

export function highlight(code: string, lang: string | null | undefined) {
	const known = lang && highlighter.getLoadedLanguages().includes(lang);
	const html = highlighter.codeToHtml(code, {
		lang: known ? lang : 'text',
		theme: THEME,
		// Theme background → blog ink, so code blocks match the page.
		colorReplacements: { '#0d1117': '#070e1c' }
	});
	// {@html} keeps Svelte from parsing braces in the code.
	return `{@html ${JSON.stringify(html)}}`;
}
