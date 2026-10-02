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
- The portfolio follows system light/dark preferences. The scene retains its golden-hour art direction.
- Hidden tabs and the open portfolio pause the animation. The 3D renderer loads when the browser is idle, initializes in stages, and compiles shaders asynchronously.
- The overview runs at up to 30 fps with cached scenery shadows. The detailed car model loads only after Take a ride is selected; a lightweight car is available immediately.
- WebGL failure leaves the portfolio accessible; model-loading failure retains a lightweight fallback car.

## Content and assets

Edit `src/app/portfolio/portfolio.data.ts` for project descriptions, links, and expertise. The current public name is Ahmad Sadieh. Contact actions and Fluentia’s website link are intentionally omitted until their destinations are supplied.

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

Deployment is not configured or performed by this refactor.
