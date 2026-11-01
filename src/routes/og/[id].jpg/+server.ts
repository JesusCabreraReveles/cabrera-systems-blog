// JPG copy of each cover for link previews: some networks (LinkedIn) don't show WebP og:image.
// Generated at build time from the post's cover, so the agent only ever writes cover.webp.
import { error } from '@sveltejs/kit';
import sharp from 'sharp';
import { posts } from '#lib/content.ts';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => [...new Set(posts.map((p) => p.id))].map((id) => ({ id }));

export const GET: RequestHandler = async ({ params }) => {
	const post = posts.find((p) => p.id === params.id);
	if (!post) error(404);
	const jpg = await sharp(`src/content/posts/${post.id}/${post.meta.cover.slice(2)}`)
		.resize(1200, 630, { fit: 'cover' })
		.flatten({ background: '#02050f' })
		.jpeg({ quality: 85, mozjpeg: true })
		.toBuffer();
	return new Response(new Uint8Array(jpg), { headers: { 'content-type': 'image/jpeg' } });
};
