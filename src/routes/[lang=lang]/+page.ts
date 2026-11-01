import { posts, postsIn } from '#lib/content.ts';
import type { Lang } from '#lib/schema/post.ts';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => [{ lang: 'en' }, { lang: 'es' }];

export const load: PageLoad = ({ params }) => {
	const lang = params.lang as Lang;
	return { lang, posts: postsIn(lang), hasPodcast: posts.some((p) => p.audio) };
};
