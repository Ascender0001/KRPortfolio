# KRPortfolio

Personal portfolio of Király Róbert — live at **[ascender.codes](https://ascender.codes/)**.

Built with React 19, TypeScript and Vite. A three.js particle field behind the page morphs into a new shape for each section as you scroll; text motion uses [anime.js](https://animejs.com/). Hosted on Netlify.

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
- `src/three/` — the WebGL particle field (`ParticleField.ts`) and the point-cloud shapes it morphs between (`shapes.ts`); `src/components/Background3D.tsx` maps scroll position to shapes. three.js is lazy-loaded.
- `src/scroll/` — scroll-scrubbed text reveals tied to a smoothed scroll position.
- `src/hooks/` — one-shot reveal helpers used in reduced-motion mode.
- `src/styles/` — design tokens, global styles and animations.
- `public/` — static files served as-is (favicon, CV, robots.txt, sitemap).

## Motion

Animations follow the OS `prefers-reduced-motion` setting: when it is on, the particle field still changes shape with scroll but calmly (no bursts, twinkle or pointer tilt) and text uses short fades. The low-key "Animációk" switch in the footer overrides this per visitor (auto → full → reduced), stored in `localStorage` under `kr-motion`. See `src/motion.ts`.

## Deployment

Netlify builds `main` automatically using `netlify.toml` (`npm run build` → `dist/`, Node 22), which also sets security and caching headers.
