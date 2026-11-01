import type { Lang } from './schema/post.ts';

export const ui = {
	en: {
		latest: 'Latest',
		archive: 'Earlier posts',
		empty: 'First post coming soon.',
		listen: 'Listen',
		readIn: 'Leer en español',
		switchTo: 'ES',
		back: 'All posts',
		sources: 'Sources',
		transcript: 'Transcript',
		audioIn: 'Audio in Spanish',
		locale: 'en_US'
	},
	es: {
		latest: 'Lo último',
		archive: 'Posts anteriores',
		empty: 'El primer post viene pronto.',
		listen: 'Escuchar',
		readIn: 'Read in English',
		switchTo: 'EN',
		back: 'Todos los posts',
		sources: 'Fuentes',
		transcript: 'Transcripción',
		audioIn: 'Audio en inglés',
		locale: 'es_MX'
	}
} satisfies Record<Lang, Record<string, string>>;

export const otherLang = (lang: Lang): Lang => (lang === 'en' ? 'es' : 'en');

export function formatDate(date: string, lang: Lang) {
	return new Date(`${date}T12:00:00`).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

export function formatDuration(seconds: number) {
	return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
