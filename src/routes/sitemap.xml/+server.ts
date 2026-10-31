import { absoluteUrl, posts, site } from '#lib/content.ts';
import type { RequestHandler } from './$types';

export const prerender = true;

const alternates = (paths: Partial<Record<string, string>>) =>
	Object.entries(paths)
		.map(([lang, path]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${absoluteUrl(path)}" />`)
		.join('');

export const GET: RequestHandler = () => {
	const indexes = Object.fromEntries(site.languages.map((lang) => [lang, lang]));
	const urls = [
		...site.languages.map((lang) => `<url><loc>${absoluteUrl(lang)}</loc>${alternates(indexes)}</url>`),
		...posts.map(
			(post) =>
				`<url><loc>${absoluteUrl(post.alternates[post.lang])}</loc><lastmod>${post.meta.date}</lastmod>${alternates(post.alternates)}</url>`
		)
	];
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
	return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
