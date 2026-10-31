// Svelte preprocessor that runs before mdsvex on post Markdown.
// Rewrites local images (![alt](./img-1.webp)) into imports so Vite bundles them;
// otherwise the browser would request ./img-1.webp relative to the post URL and 404.
import type { PreprocessorGroup } from 'svelte/compiler';

const LOCAL_IMAGE = /!\[([^\]]*)\]\((\.\/[a-z0-9-]+\.(?:webp|png|jpe?g|gif|svg))\)/g;

const escapeAttr = (text: string) => text.replace(/[&"<>{}]/g, (c) => `&#${c.charCodeAt(0)};`);

export function mdImages(): PreprocessorGroup {
	return {
		name: 'md-images',
		markup({ content, filename }) {
			if (!filename?.includes('/src/content/posts/') || !filename.endsWith('.md')) return;

			const imports = new Map<string, string>();
			const body = content.replace(LOCAL_IMAGE, (_, alt: string, src: string) => {
				if (!imports.has(src)) imports.set(src, `__img${imports.size}`);
				return `<img src={${imports.get(src)}} alt="${escapeAttr(alt)}" loading="lazy" />`;
			});
			if (!imports.size) return;

			const script = `<script>\n${[...imports]
				.map(([src, name]) => `\timport ${name} from '${src}';`)
				.join('\n')}\n</script>\n`;
			// Keep the frontmatter first; mdsvex expects it at the top.
			const frontmatter = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(body)?.[0] ?? '';
			return { code: frontmatter + script + body.slice(frontmatter.length) };
		}
	};
}
