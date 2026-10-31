import { absoluteAsset, absoluteUrl, postsIn, site } from '#lib/content.ts';
import type { Lang } from '#lib/schema/post.ts';
import { escapeXml } from '#lib/xml.ts';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => site.languages.map((lang) => ({ lang }));

export const GET: RequestHandler = ({ params }) => {
	const lang = params.lang as Lang;
	const self = absoluteUrl(`${lang}/rss.xml`);
	const items = postsIn(lang).map((post) => {
		const url = absoluteUrl(post.alternates[lang]);
		return `
		<item>
			<title>${escapeXml(post.meta.title)}</title>
			<link>${url}</link>
			<guid isPermaLink="true">${url}</guid>
			<description>${escapeXml(post.meta.description)}</description>
			<pubDate>${new Date(`${post.meta.date}T12:00:00-06:00`).toUTCString()}</pubDate>
		</item>`;
	});

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${escapeXml(site.title)}</title>
		<link>${absoluteUrl(lang)}</link>
		<description>${escapeXml(site.tagline[lang])}</description>
		<language>${lang}</language>
		<atom:link href="${self}" rel="self" type="application/rss+xml" />${items.join('')}
	</channel>
</rss>
`;
	return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
};
