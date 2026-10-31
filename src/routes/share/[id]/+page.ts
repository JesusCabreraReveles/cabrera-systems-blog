import { error } from '@sveltejs/kit';
import { posts } from '#lib/content.ts';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => [...new Set(posts.map((p) => p.id))].map((id) => ({ id }));

export const load: PageLoad = async ({ params }) => {
	const versions = posts.filter((p) => p.id === params.id).sort((a) => (a.meta.original ? -1 : 1));
	if (!versions.length) error(404);
	return {
		id: params.id,
		versions: await Promise.all(versions.map(async (post) => ({ post, Body: await post.load() })))
	};
};
