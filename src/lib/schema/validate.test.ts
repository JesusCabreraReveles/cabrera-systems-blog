// Contract tests: the rules talkingwithmyself-agent relies on. Run with `npm test`.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { SiteConfig } from './site.ts';
import { validatePostFolder, validateSlugs, type PostFolder } from './validate.ts';

const site = { tags: [{ id: 'tec', label: { en: 'Tech', es: 'Tec' } }] } as SiteConfig;

const md = (fields: Record<string, unknown>) =>
	`---\n${Object.entries(fields)
		.map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
		.join('\n')}\n---\nBody\n`;

const base = (lang: string, extra: Record<string, unknown> = {}) => ({
	schemaVersion: 1,
	title: 'Title',
	slug: `slug-${lang}`,
	lang,
	original: lang === 'es',
	date: '2026-11-03',
	description: 'Description',
	cover: './cover.webp',
	coverAlt: 'Alt',
	tags: ['tec'],
	...extra
});

const folder = (en: Record<string, unknown> = {}, es: Record<string, unknown> = {}, files = ['cover.webp']): PostFolder => ({
	id: '202611031222-sample',
	files,
	markdown: { en: md(base('en', en)), es: md(base('es', es)) }
});

const errors = (f: PostFolder) => validatePostFolder(f, site).errors;

test('a valid folder passes', () => {
	const result = validatePostFolder(folder(), site);
	assert.deepEqual(result.errors, []);
	assert.equal(result.posts.length, 2);
});

test('folder id format and length', () => {
	assert.match(errors({ ...folder(), id: 'sample' }).join(), /folder id/);
	assert.match(errors({ ...folder(), id: `202611031222-${'a'.repeat(31)}` }).join(), /longer than 30/);
});

test('both languages are required', () => {
	assert.match(errors({ ...folder(), markdown: { es: md(base('es')) } }).join(), /missing en\.md/);
});

test('unknown fields are rejected (strict schema)', () => {
	assert.match(errors(folder({ canonical: 'https://x.dev' })).join(), /canonical|Unrecognized/);
});

test('tags must exist in site.yaml', () => {
	assert.match(errors(folder({ tags: ['nope'] }, { tags: ['nope'] })).join(), /tag "nope"/);
});

test('cover file must exist', () => {
	assert.match(errors(folder({}, {}, [])).join(), /cover\.webp not found/);
});

test('exactly one original', () => {
	assert.match(errors(folder({ original: true })).join(), /exactly one/);
});

test('shared fields must match across languages', () => {
	assert.match(errors(folder({ date: '2026-11-04' })).join(), /date differs/);
});

const audio = { audio: './audio.mp3', audioLang: 'es', duration: 60 };

test('audio is opt-in: all three fields together, plus transcript.md', () => {
	assert.deepEqual(errors(folder(audio, audio, ['cover.webp', 'audio.mp3', 'transcript.md'])), []);
	assert.match(errors(folder(audio, audio, ['cover.webp', 'audio.mp3'])).join(), /transcript\.md/);
	const partial = { audio: './audio.mp3' };
	assert.notDeepEqual(errors(folder(partial, partial, ['cover.webp', 'audio.mp3', 'transcript.md'])), []);
});

test('audioLang must be the original language', () => {
	const en = { ...audio, audioLang: 'en' };
	assert.match(errors(folder(en, en, ['cover.webp', 'audio.mp3', 'transcript.md'])).join(), /audioLang/);
});

test('slugs are unique per language', () => {
	const a = validatePostFolder(folder(), site).posts;
	const b = a.map((p) => ({ ...p, id: '202611041000-other' }));
	assert.match(validateSlugs([...a, ...b]).join(), /already used/);
});
