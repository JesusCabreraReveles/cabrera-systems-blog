import { error } from '@sveltejs/kit';
import { posts } from '#lib/content.ts';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => posts.map((p) => ({ lang: p.lang, slug: p.meta.slug }));

export const load: PageLoad = async ({ params }) => {
	const post = posts.find((p) => p.lang === params.lang && p.meta.slug === params.slug);
	if (!post) error(404);
	return { post, Body: await post.load() };
};
