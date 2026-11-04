// Loads site.yaml and posts at build time. Validation is the same as scripts/contract.ts,
// so a post that passes the contract always loads here.
import type { Component } from 'svelte';
import { parse } from 'yaml';
import { LANGS, type Lang, type PostFrontmatter } from './schema/post.ts';
import { SiteConfig } from './schema/site.ts';
import { validatePostFolder, validateSlugs, type ValidPost } from './schema/validate.ts';
import siteRaw from '../content/site.yaml?raw';

const POSTS = '/src/content/posts/';

export const site = SiteConfig.parse(parse(siteRaw));

const markdown = import.meta.glob<string>('/src/content/posts/*/{en,es}.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});
const components = import.meta.glob<Component>('/src/content/posts/*/{en,es}.md', {
	import: 'default'
});
const images = import.meta.glob<string>('/src/content/posts/*/*.webp', {
	eager: true,
	query: '?url',
	import: 'default'
});
// Opt-in audio: only posts the author chose to publish with their voice.
const audios = import.meta.glob<string>('/src/content/posts/*/*.mp3', {
	eager: true,
	query: '?url',
	import: 'default'
});
const transcripts = import.meta.glob<string>('/src/content/posts/*/transcript.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});
// Texts written by talkingwithmyself-agent for the Share Kit (never shown on public pages).
const shareFiles = import.meta.glob<string>('/src/content/posts/*/share/*', {
	eager: true,
	query: '?raw',
	import: 'default'
});
// Only the file names matter, for the folder rules.
const allFiles = Object.keys(import.meta.glob('/src/content/posts/*/**', { query: '?url' }));

export type Post = {
	id: string;
	lang: Lang;
	meta: PostFrontmatter;
	coverUrl: string;
	/** Only when the post publishes audio. */
	audio?: { url: string; file: string; transcript: string };
	/** URL of the same post in the other languages. */
	alternates: Partial<Record<Lang, string>>;
	/** Raw Markdown body, without frontmatter. */
	body: string;
	/** Built URLs of the folder's images, by file name (e.g. "img-1.webp"). */
	images: Record<string, string>;
	/** Files in share/, by name (e.g. "linkedin.es.txt"). */
	share: Record<string, string>;
	load: () => Promise<Component>;
};

const filesUnder = <T>(files: Record<string, T>, prefix: string) =>
	Object.fromEntries(
		Object.entries(files)
			.filter(([path]) => path.startsWith(prefix))
			.map(([path, value]) => [path.slice(prefix.length), value])
	);

function loadPosts(): Post[] {
	const ids = [...new Set(allFiles.map((f) => f.slice(POSTS.length).split('/')[0]))];
	const valid: ValidPost[] = [];
	const errors: string[] = [];

	for (const id of ids) {
		const prefix = `${POSTS}${id}/`;
		const result = validatePostFolder(
			{
				id,
				files: allFiles.filter((f) => f.startsWith(prefix)).map((f) => f.slice(prefix.length)),
				markdown: Object.fromEntries(
					LANGS.filter((l) => markdown[`${prefix}${l}.md`] !== undefined).map((l) => [
						l,
						markdown[`${prefix}${l}.md`]
					])
				)
			},
			site
		);
		errors.push(...result.errors);
		valid.push(...result.posts);
	}
	errors.push(...validateSlugs(valid));
	if (errors.length) throw new Error(`Invalid content:\n  ${errors.join('\n  ')}`);

	return valid
		.filter((p) => !p.frontmatter.draft)
		.map((p) => {
			const prefix = `${POSTS}${p.id}/`;
			const siblings = valid.filter((s) => s.id === p.id);
			return {
				id: p.id,
				lang: p.lang,
				meta: p.frontmatter,
				coverUrl: images[prefix + p.frontmatter.cover.slice(2)],
				audio: p.frontmatter.audio
					? {
							url: audios[prefix + p.frontmatter.audio.slice(2)],
							file: prefix.slice(1) + p.frontmatter.audio.slice(2),
							transcript: transcripts[`${prefix}transcript.md`]
						}
					: undefined,
				alternates: Object.fromEntries(siblings.map((s) => [s.lang, postPath(s.lang, s.frontmatter.slug)])),
				body: p.body,
				images: filesUnder(images, prefix),
				share: filesUnder(shareFiles, `${prefix}share/`),
				load: components[`${prefix}${p.lang}.md`]
			};
		})
		.sort((a, b) => b.meta.date.localeCompare(a.meta.date) || b.id.localeCompare(a.id));
}

export const posts = loadPosts();

/** Relative to the base path, as `resolve()` expects. */
export function postPath(lang: Lang, slug: string) {
	return `${lang}/${slug}`;
}

/** Absolute URL for a base-relative path, e.g. "es/mi-post". */
export function absoluteUrl(path = '') {
	return path ? `${site.baseUrl}/${path}` : site.baseUrl;
}

/** Absolute URL for a built asset (already includes the base path). */
export function absoluteAsset(url: string) {
	return new URL(url, site.baseUrl).href;
}

export function postsIn(lang: Lang) {
	return posts.filter((p) => p.lang === lang);
}
