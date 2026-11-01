// Podcast feed (Spotify, Apple Podcasts): one episode per post published with audio.
// Episodes are in the language the author spoke, so each links to its original version.
import { statSync } from 'node:fs';
import { absoluteAsset, absoluteUrl, posts, site } from '#lib/content.ts';
import { escapeXml } from '#lib/xml.ts';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const self = absoluteUrl('podcast.xml');
	const items = posts
		.filter((post) => post.audio && post.meta.original)
		.map((post) => {
			const url = absoluteUrl(post.alternates[post.lang]);
			return `
		<item>
			<title>${escapeXml(post.meta.title)}</title>
			<link>${url}</link>
			<guid isPermaLink="false">${post.id}</guid>
			<description>${escapeXml(post.meta.description)}</description>
			<pubDate>${new Date(`${post.meta.date}T12:00:00-06:00`).toUTCString()}</pubDate>
			<enclosure url="${absoluteAsset(post.audio!.url)}" length="${statSync(post.audio!.file).size}" type="audio/mpeg" />
			<itunes:duration>${post.meta.duration}</itunes:duration>
			<itunes:explicit>false</itunes:explicit>
		</item>`;
		});

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
	<channel>
		<title>${escapeXml(site.title)}</title>
		<link>${site.baseUrl}</link>
		<description>${escapeXml(`${site.tagline.es} / ${site.tagline.en}`)}</description>
		<language>es</language>
		<atom:link href="${self}" rel="self" type="application/rss+xml" />
		<itunes:author>${escapeXml(site.author.name)}</itunes:author>
		<itunes:image href="${absoluteUrl('podcast-cover.png')}" />
		<itunes:category text="Technology" />
		<itunes:explicit>false</itunes:explicit>
		<itunes:type>episodic</itunes:type>${items.join('')}
	</channel>
</rss>
`;
	return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
};
