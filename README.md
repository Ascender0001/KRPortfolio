# KRPortfolio

Personal portfolio of Király Róbert — live at **[ascender.codes](https://ascender.codes/)**.

Built with React 19, TypeScript and Vite, with entrance/scroll motion driven by [anime.js](https://animejs.com/). Hosted on Netlify.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
npm run lint     # oxlint
```

## Structure

- `src/data/portfolio.ts` — all site content (text, projects, skills, contact channels). Edit this to update the page.
- `src/components/` — page sections (Hero, About, Skills, Projects, Contact, …).
- `src/hooks/` — motion helpers (`useReveal`, `useStaggerChildren`, `useTilt`).
- `src/styles/` — design tokens, global styles and animations.
- `public/` — static files served as-is (favicon, CV, robots.txt, sitemap).

## Motion

Animations respect the OS `prefers-reduced-motion` setting. Append `?motion=force` to the URL to preview them anyway.

## Deployment

Netlify builds `main` automatically using `netlify.toml` (`npm run build` → `dist/`, Node 22), which also sets security and caching headers.
