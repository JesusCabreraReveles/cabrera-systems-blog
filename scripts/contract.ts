// Checks the content contract. Runs before every build.
//   node scripts/contract.ts           validate content + fail if schema/*.json is stale
//   node scripts/contract.ts --write   regenerate schema/*.json
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';
import { LANGS, PostFrontmatter, SCHEMA_VERSION } from '../src/lib/schema/post.ts';
import { SiteConfig } from '../src/lib/schema/site.ts';
import { validatePostFolder, validateSlugs, type ValidPost } from '../src/lib/schema/validate.ts';

const ROOT = join(import.meta.dirname, '..');
const POSTS_DIR = join(ROOT, 'src/content/posts');
const SCHEMA_DIR = join(ROOT, 'schema');
const write = process.argv.includes('--write');
const errors: string[] = [];

// 1. JSON Schemas consumed by talkingwithmyself-agent.
const jsonSchemas = {
	'post.schema.json': {
		...z.toJSONSchema(PostFrontmatter, { io: 'input' }),
		$id: 'https://cabrera.systems/blog/schema/post.schema.json',
		title: `Post frontmatter (schemaVersion ${SCHEMA_VERSION})`
	},
	'site.schema.json': {
		...z.toJSONSchema(SiteConfig, { io: 'input' }),
		$id: 'https://cabrera.systems/blog/schema/site.schema.json',
		title: 'src/content/site.yaml'
	}
};
mkdirSync(SCHEMA_DIR, { recursive: true });
for (const [name, schema] of Object.entries(jsonSchemas)) {
	const path = join(SCHEMA_DIR, name);
	const json = JSON.stringify(schema, null, '\t') + '\n';
	if (write) writeFileSync(path, json);
	else if (!existsSync(path) || readFileSync(path, 'utf8') !== json) {
		errors.push(`schema/${name} is stale: run npm run schema`);
	}
}

// 2. site.yaml
const siteResult = SiteConfig.safeParse(parse(readFileSync(join(ROOT, 'src/content/site.yaml'), 'utf8')));
if (!siteResult.success) {
	for (const issue of siteResult.error.issues) {
		errors.push(`site.yaml: ${issue.path.join('.')}: ${issue.message}`);
	}
}

// 3. Posts
const posts: ValidPost[] = [];
if (siteResult.success && existsSync(POSTS_DIR)) {
	for (const entry of readdirSync(POSTS_DIR, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const dir = join(POSTS_DIR, entry.name);
		const files = readdirSync(dir, { recursive: true, withFileTypes: true })
			.filter((f) => f.isFile())
			.map((f) => relative(dir, join(f.parentPath, f.name)));
		const markdown = Object.fromEntries(
			LANGS.filter((l) => files.includes(`${l}.md`)).map((l) => [
				l,
				readFileSync(join(dir, `${l}.md`), 'utf8')
			])
		);
		const result = validatePostFolder({ id: entry.name, files, markdown }, siteResult.data);
		errors.push(...result.errors);
		posts.push(...result.posts);
	}
	errors.push(...validateSlugs(posts));
}

if (errors.length) {
	console.error(`✗ content contract: ${errors.length} error(s)\n  ` + errors.join('\n  '));
	process.exit(1);
}
console.log(
	write ? '✔ schema/*.json written' : `✔ content contract OK (${posts.length / LANGS.length} posts)`
);
