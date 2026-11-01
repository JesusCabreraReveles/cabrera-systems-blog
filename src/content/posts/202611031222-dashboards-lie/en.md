---
schemaVersion: 1
title: Observability dashboards lie
slug: observability-dashboards-lie
lang: en
original: false
date: 2026-11-03
description: A green dashboard doesn't mean the system is healthy. It means you're measuring what you already knew how to measure.
cover: ./cover.webp
coverAlt: Sample cover with a blue grid and a circle
tags: [tec, ideas]
hashtags: [observability, sre]
audio: ./audio.mp3
audioLang: es
duration: 12
---

> Sample post to test the design. Deleted before publishing.

## Key ideas

- A green dashboard measures what you already knew how to measure.
- Real incidents live in what you didn't instrument.

![Sample diagram with an orange rectangle](./img-1.webp)

```ts
const healthy = (p99: number) => p99 < 300; // { braces } survive
```
