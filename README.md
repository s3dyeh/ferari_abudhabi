# Ahmad Sadieh · Cinematic precision portfolio

A single-screen Angular 21 / Three.js portfolio. A golden-hour desert coaster sets the scene; the sun opens an accessible portfolio of real projects.

## Run locally

```powershell
npm ci
npm start
```

Open http://localhost:4200. Node 20.19+, 22.12+, or a supported newer LTS is required by Angular 21. Development here was verified with Node 24.

```powershell
npm run build
npm test -- --watch=false
```

The production output is `dist/Animator/browser`. No backend or external API keys are required.
The build also emits gzip and Brotli versions; configure the static host to serve them with the appropriate `Content-Encoding` header. For a local production preview, use `npx http-server dist/Animator/browser -p 4300 -g -b`.

## Experience

- Overview starts with a composed view. Take a ride switches to the moving camera.
- The scene runs continuously during normal viewing. Overview and Take a ride select the camera view; on mobile, the sun glides beneath the clock during a ride.
- The sun opens a native modal dialog. Escape or Back to the sun dismisses it; focus returns to the sun.
- The page stays within the viewport. Only the portfolio content scrolls.
- The Amman clock explicitly uses `Asia/Amman` through Intl, including weekday and date. It is independent of the visitor’s timezone.
- Reduced-motion preferences remove the sun movement transition, camera transition, and portfolio reveal animation.
- The interface and scene follow Asia/Amman time: day from 06:00 to 18:00, night otherwise.
- Hidden tabs and the open portfolio pause the animation. The 3D renderer loads when the browser is idle, initializes in stages, and compiles shaders asynchronously.
- The overview runs at up to 30 fps with cached scenery shadows. The detailed car model loads only after Take a ride is selected; a lightweight car is available immediately.
- WebGL failure leaves the portfolio accessible; model-loading failure retains a lightweight fallback car.

## Content and assets

Edit `src/app/portfolio/portfolio.data.ts` for project descriptions, links, and expertise. The public identity is Ahmad Sadieh, also known as s3dyeh. The contact address is s3dyeh00@gmail.com; Fluentia’s website link is omitted until its destination is supplied.

FarasJo and Hydrogen previews were captured from the supplied public project websites. Veasyo and Fluentia previews come from the supplied screenshots; the Veasyo waiter view excludes private account and billing details. WebP previews are resized to 1200 pixels wide and lazy-loaded. Project screenshots are evidence of those interfaces, not simulated designs.

The existing `public/rb6.glb` model is retained. The coaster scene is artistic and does not claim to reconstruct a real attraction. Its closed Catmull-Rom curve, paired rails, instanced ties/supports, procedural dunes, and lighting are implemented locally.

## Architecture

- App owns camera mode, modal state, and focus restoration.
- Animation component owns browser event lifecycles; its scoped service owns GPU resources, model loading, and the fixed-step simulation.
- The render loop runs outside Angular change detection, uses bounded elapsed time, and caps pixel ratio.
- Clock and portfolio are DOM components independent of WebGL.
- The native dialog supplies modal semantics and background inertness, with explicit keyboard focus cycling.

## Verification

The implementation passed 14 unit tests and 61 browser checks. A local Lighthouse simulated-mobile run against the compressed production build scored 71 for performance and 100 for accessibility, best practices, and SEO, with 2.3 s LCP, zero layout shift, and 1,650 ms total blocking time. Scene initialization remains the main performance cost on slower devices. Reports and screenshots are saved in `artifacts/verification`.

Unit tests cover timezone conversion, midnight rollover, timer cleanup, track continuity, independent vector samples, frame-rate equivalence, scene controls, dialog state, and fallback portfolio access.

For repeatable real-browser checks, launch a local Chromium session with agent-browser:

```powershell
npx agent-browser open http://127.0.0.1:4200/
npx agent-browser get cdp-url
node scripts/verify-browser.mjs <the-returned-websocket-url>
```

The browser script checks six viewport sizes, modal focus cycling, Escape, screenshot loading, camera controls, reduced motion, dark mode, a Los Angeles browser timezone, and simulated context loss. It saves screenshots and a JSON report under `artifacts/verification`. The 720 × 450 check models the CSS viewport of a 1440 × 900 browser at 200% zoom.

Additional accessibility checks:

```powershell
npx agent-browser a11y --json
```

The checked-in `vercel.json` configures a static production build. Changing files locally does not publish them or request search-engine indexing.


## Search and social sharing

Production canonical origin: `https://www.s3dyeh.com`. This matches the existing live redirect from `s3dyeh.com` to `www.s3dyeh.com`, observed on 25 October 2026. Canonical tags, Open Graph URLs, structured data, robots and sitemap all use that same origin.

Seven public pages are prerendered at build time, with their text and links in the initial HTML:

| Route | Purpose |
| --- | --- |
| `/` | Personal identity and cinematic experience, with links to the content pages |
| `/about/` | Direct answers to “Who is Ahmad Sadieh?” and “Who is s3dyeh?”, background, public profiles and contact |
| `/work/` | Project evidence, services, certifications and ten FAQ disclosures |
| `/expertise/` | Overview and navigation for the engineering specialties |
| `/expertise/angular-nodejs/` | Full-stack application development and related projects |
| `/expertise/ai-rag-agents/` | LLM integration, RAG, AI agents, toolkit and internal-project scope |
| `/expertise/database-api-performance/` | Oracle, PostgreSQL, API troubleshooting and backend integrations |

`src/app/site-content.ts` owns the public identity, social URLs, page metadata and editorial content. The routes derive from its content-page list. `src/app/seo.ts` emits the Person entity (including `alternateName: s3dyeh`), WebSite alternate names, the appropriate page type and breadcrumbs. The About page is the ProfilePage; the portfolio is a CollectionPage. `src/index.html` supplies consistent fallback/social metadata. FAQ content lives in `src/app/faq.data.ts`. Update `public/sitemap.xml` when public routes change; verification catches missing or orphan pages and broken project fragments.

`npm run build` checks the actual generated HTML before compression: unique titles/descriptions, identity and alias schema, canonicals, breadcrumbs, reachable pages, internal anchors, project privacy, FAQs, certificates, sitemap, robots and the 1200 × 630 social preview. It does not execute JavaScript to obtain page content. Run `npm run verify:seo` to check an existing build.

### Hosting and release checks

The live site previously returned the homepage with HTTP 200 for an arbitrary nonexistent URL. `vercel.json` selects the static preset (`framework: null`), explicitly builds with `npm run build`, serves `dist/Animator/browser`, and normalizes trailing slashes. This avoids the Angular SPA fallback; each public route has its own `index.html`. `public/404.html` supplies a noindex error page. Do not add a catch-all rewrite to `/` or `/index.html`. The static build does not need a Node server.

Deploy the entire output directory through the existing Vercel project. Preserve the existing permanent apex-to-www redirect. If the Vercel dashboard has additional routes or rewrites, remove any catch-all homepage rule before release. The repository configuration cannot prove that external routing settings are correct; verify the deployed HTTP responses:

```powershell
npm run verify:seo -- --url https://www.s3dyeh.com
```

This also checks that every canonical page resolves directly, unknown URLs return a real 404, and the apex domain redirects permanently while preserving the path. A local static preview can be checked with the same command using `--url http://127.0.0.1:4300`.

### Search Console follow-through

After deployment, use the owner's verified Google Search Console property to submit `https://www.s3dyeh.com/sitemap.xml`. Inspect `/`, `/about/`, `/work/` and the specialty pages: confirm successful live retrieval, rendered content and the Google-selected canonical, then request indexing for the updated pages. The Search Console account and its indexing reports have not been accessed by this change.

Track impressions, clicks and position for `s3dyeh`, `Ahmad Sadieh`, `who is s3dyeh`, `who is Ahmad Sadieh`, and combinations of the name with the actual specialties. Broad terms such as `Angular` or `AI` have very different competition and intent; code changes cannot promise first place, indexing or a fixed improvement date. Keep the same public name, nickname and website URL on profiles you control, and add useful project write-ups with genuine evidence over time.

Keep preview deployments out of indexing with hosting access controls or a preview-only noindex header. The production robots file intentionally permits crawling. The FAQ section serves visitors and makes no claim of Google FAQ rich-result eligibility. There are no invented reviews, ratings, credentials, locations or keyword-only doorway pages.

Reference guidance: [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [profile structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page), [site names](https://developers.google.com/search/docs/appearance/site-names), [HTTP status codes](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes), and [Vercel project configuration](https://vercel.com/docs/project-configuration).
