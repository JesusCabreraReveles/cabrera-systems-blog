import { defineParams } from '@sveltejs/kit/params';
import { Lang } from '#lib/schema/post.ts';

export const params = defineParams({ lang: Lang });
