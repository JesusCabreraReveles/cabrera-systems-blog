# Talking With Myself

Bilingual (EN/ES) blog at [cabrera.systems/blog](https://cabrera.systems/blog). Posts start as voice notes; `talkingwithmyself-agent` turns them into Markdown and opens a PR here.

SvelteKit + mdsvex + Tailwind 4, fully prerendered on Vercel.

## Run

Node 22.18+.

```sh
npm install
npm run dev        # http://localhost:5173/blog
npm test           # contract tests
npm run check      # types
npm run build      # validates every post first (scripts/contract.ts)
```

## Posts

```
src/content/posts/<YYYYMMDDHHmm>-<slug>/
  en.md, es.md        # one is original: true, the other an adaptation
  cover.webp          # 1200×630
  img-N.webp          # optional, used as ![alt](./img-N.webp)
  audio.mp3           # optional, with transcript.md (opt-in per post)
  share/              # optional texts for the Share Kit
```

The frontmatter schema (`src/lib/schema/post.ts`, published as `schema/post.schema.json`) is the contract with the agent. Any breaking change bumps `schemaVersion`. Tags and links live in `src/content/site.yaml`.

A post with an invalid frontmatter, a missing language or a missing file fails the build, so what is live stays as it was. `draft: true` unpublishes it.

## Routes

| Path | |
|---|---|
| `/blog` | Redirects by browser language |
| `/blog/{en,es}` | Post list |
| `/blog/{en,es}/<slug>` | Post |
| `/blog/{en,es}/rss.xml` | RSS per language |
| `/blog/podcast.xml` | Podcast feed (posts with audio) |
| `/blog/sitemap.xml` | Sitemap with `hreflang` |
| `/blog/share` | Share Kit (unlisted, `noindex`) |

Mounting under cabrera.systems: [`docs/montar-en-cabrera-systems.md`](docs/montar-en-cabrera-systems.md).
