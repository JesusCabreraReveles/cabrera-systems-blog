import { posts } from '#lib/content.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = () => ({
	// One entry per folder, titled in the original language.
	posts: posts.filter((p) => p.meta.original)
});
