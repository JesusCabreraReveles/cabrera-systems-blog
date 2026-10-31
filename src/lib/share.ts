// Share Kit texts. Prefers what talkingwithmyself-agent wrote in share/;
// falls back to text derived from the post so every post can be shared.
import { absoluteAsset, absoluteUrl, site, type Post } from './content.ts';

const X_LIMIT = 280;
const X_URL_LENGTH = 23; // X counts every link as 23 chars.

const hashtags = (post: Post) => post.meta.hashtags.map((tag) => `#${tag}`).join(' ');

export function canonicalUrl(post: Post) {
	return absoluteUrl(post.alternates[post.lang]);
}

export function linkedinText(post: Post) {
	return (
		post.share[`linkedin.${post.lang}.txt`] ??
		[post.meta.title, post.meta.description, canonicalUrl(post), hashtags(post)].filter(Boolean).join('\n\n')
	);
}

export function xText(post: Post) {
	const fromAgent = post.share[`x.${post.lang}.txt`];
	if (fromAgent) return fromAgent;
	const tail = `\n\n${canonicalUrl(post)}`;
	const tags = hashtags(post);
	const withTags = `${post.meta.title}${tags ? `\n\n${tags}` : ''}`;
	return (xLength(withTags + tail) <= X_LIMIT ? withTags : post.meta.title) + tail;
}

/** Length as X counts it: links are always 23 chars. */
export function xLength(text: string) {
	return [...text.replace(/https?:\/\/\S+/g, 'x'.repeat(X_URL_LENGTH))].length;
}
export { X_LIMIT };

/** Markdown for dev.to / Hashnode, with canonical_url back to the blog. */
export function devtoMarkdown(post: Post) {
	const fromAgent = post.share[`devto.${post.lang}.md`];
	if (fromAgent) return fromAgent;

	const body = post.body.replace(/\]\(\.\/([a-z0-9-]+\.[a-z]+)\)/g, (match, file: string) =>
		post.images[file] ? `](${absoluteAsset(post.images[file])})` : match
	);
	// dev.to: max 4 tags, lowercase alphanumeric.
	const tags = post.meta.hashtags
		.map((tag) => tag.toLowerCase().replace(/[^a-z0-9]/g, ''))
		.filter(Boolean)
		.slice(0, 4);
	const quote = (text: string) => JSON.stringify(text);
	return `---
title: ${quote(post.meta.title)}
published: false
description: ${quote(post.meta.description)}
tags: ${tags.join(', ')}
canonical_url: ${canonicalUrl(post)}
cover_image: ${absoluteAsset(post.coverUrl)}
---
${body.trim()}

---

*${post.lang === 'es' ? 'Publicado originalmente en' : 'Originally published at'} [${site.title}](${canonicalUrl(post)}).*
`;
}
