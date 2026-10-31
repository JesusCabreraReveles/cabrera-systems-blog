# Montar el blog en `cabrera.systems/blog`

Etapa 2. Se hace **en el repo del portafolio** (`~/code/myPortfolio`), no aquí: este repo no puede tocarlo.
Requiere que el blog ya esté desplegado en Vercel (producción en `*.vercel.app`).

## Cómo funciona

El portafolio hace de *proxy*: todo lo que llegue a `cabrera.systems/blog/*` se sirve desde el proyecto del blog.
El blog ya genera todo bajo `/blog` (`paths.base`), así que no hay que reescribir rutas.

```
cabrera.systems/            → proyecto my-portfolio (sin cambios)
cabrera.systems/blog/*      → rewrite → <blog>.vercel.app/blog/*
```

Hoy el portafolio **no tiene** `vercel.json` ni `robots.txt`, así que son dos archivos nuevos y nada existente cambia.

## Cambios en el portafolio

Sustituir `<blog>` por el dominio de producción del proyecto del blog (p.ej. `cabrera-systems-blog.vercel.app`).

### 1. `vercel.json` (raíz del repo del portafolio)

```json
{
	"rewrites": [
		{ "source": "/blog", "destination": "https://<blog>/blog" },
		{ "source": "/blog/:path*", "destination": "https://<blog>/blog/:path*" }
	]
}
```

### 2. `public/robots.txt`

Google solo lee el `robots.txt` de la raíz del dominio; el de `/blog/robots.txt` no cuenta.

```
User-agent: *
Disallow: /blog/share

Sitemap: https://cabrera.systems/blog/sitemap.xml
```

### 3. (Opcional) Enlace al blog en el menú del portafolio

`src/App.svelte`, junto a los demás enlaces del `<nav>`: `href="/blog"`.

## Pasos

1. Rama en el portafolio (p.ej. `add-blog-mount`) con los cambios de arriba.
2. Push → Vercel genera el **preview** del portafolio.
3. En el preview, comprobar:
   - `/` sigue igual (el portafolio no cambia).
   - `/blog` redirige a `/blog/es` o `/blog/en`.
   - `/blog/es`, un post, `/blog/es/rss.xml`, `/blog/sitemap.xml` y una URL rota (404 con glitch).
   - Las imágenes y el CSS cargan (rutas `/blog/_app/...`).
   - `/robots.txt` tiene la línea `Sitemap`.
4. Merge a `master` del portafolio → producción.
5. Google Search Console: enviar `https://cabrera.systems/blog/sitemap.xml`.
6. Probar una URL de post en el [Post Inspector de LinkedIn](https://www.linkedin.com/post-inspector/) y en X para confirmar la imagen de portada (ver nota de WebP abajo).

## Deshacer

Borrar `vercel.json` del portafolio y hacer deploy. El portafolio vuelve a estar exactamente como antes; el blog sigue vivo en `<blog>.vercel.app/blog`.

## Notas

- **Costo:** los rewrites a un dominio externo están incluidos en Vercel Hobby.
- **Alternativa:** Vercel Microfrontends (también incluido en Hobby, 50K/mes). Más integrado, pero más configuración; el rewrite basta para un blog estático.
- **Portadas WebP:** algunas redes (LinkedIn en particular) no siempre muestran `og:image` en WebP. Si el Post Inspector no muestra la portada, la solución es que el agente genere también un `cover.jpg` para OG.
