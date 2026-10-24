import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const canonicalOrigin = 'https://www.s3dyeh.com';
const base = 'dist/Animator/browser';
const args = process.argv.slice(2);
assert.ok(args.length === 0 || (args.length === 2 && args[0] === '--url'), 'Usage: node scripts/verify-seo.mjs [--url https://www.s3dyeh.com]');
const liveOrigin = args.length ? new URL(args[1]).origin : null;
const paths = ['/', '/about/', '/work/', '/expertise/', '/expertise/angular-nodejs/', '/expertise/ai-rag-agents/', '/expertise/database-api-performance/'];
const documents = new Map();
const titles = new Set();
const descriptions = new Set();

async function read(path, binary = false) {
  if (!liveOrigin) return readFile(base + path, binary ? undefined : 'utf8');
  const response = await fetch(liveOrigin + path, { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, path + ' must return 200');
  assert.ok(!/noindex/i.test(response.headers.get('x-robots-tag') || ''), path + ' must be indexable');
  assert.equal(response.url, liveOrigin + path, path + ' must resolve without redirects');
  if (path.endsWith('/')) assert.match(response.headers.get('content-type') || '', /text\/html/, path);
  return binary ? Buffer.from(await response.arrayBuffer()) : response.text();
}

for (const path of paths) {
  const html = await read(liveOrigin ? path : path + 'index.html');
  const document = new JSDOM(html, { url: canonicalOrigin + path }).window.document;
  documents.set(path, document);
  const canonical = canonicalOrigin + path;
  const tag = selector => {
    assert.equal(document.querySelectorAll(selector).length, 1, path + ': exactly one ' + selector);
    return document.querySelector(selector);
  };
  assert.equal(tag('link[rel="canonical"]').href, canonical, path + ': canonical host/path');
  assert.equal(tag('meta[property="og:url"]').content, canonical);
  assert.equal(tag('meta[property="og:image"]').content, canonicalOrigin + '/social-preview.png');
  assert.equal(tag('meta[name="twitter:image"]').content, canonicalOrigin + '/social-preview.png');
  assert.equal(tag('meta[property="og:title"]').content, document.title);
  assert.equal(tag('meta[name="twitter:title"]').content, document.title);
  assert.match(tag('title').textContent, /Ahmad Sadieh.*s3dyeh/);
  assert.ok(!titles.has(document.title), path + ': unique title'); titles.add(document.title);
  const description = tag('meta[name="description"]').content;
  assert.ok(description.length > 80 && description.length < 220, path + ': descriptive summary');
  assert.ok(!descriptions.has(description), path + ': unique description'); descriptions.add(description);
  assert.equal(tag('meta[property="og:description"]').content, description);
  assert.equal(tag('meta[name="twitter:description"]').content, description);
  assert.ok(!/noindex|nofollow/i.test(tag('meta[name="robots"]').content));
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(document.querySelectorAll('h1').length, 1, path + ': one primary heading');
  assert.match(document.querySelector('main')?.textContent || '', /Ahmad Sadieh/);
  assert.match(document.querySelector('main')?.textContent || '', /s3dyeh/);
  assert.ok(!html.includes('$25.00'));

  const graph = JSON.parse(tag('#site-schema').textContent)['@graph'];
  const person = graph.find(entity => entity['@type'] === 'Person');
  assert.equal(person?.name, 'Ahmad Sadieh');
  assert.equal(person?.alternateName, 's3dyeh');
  assert.equal(person?.url, canonicalOrigin + '/about/');
  assert.ok(person.sameAs.includes('https://github.com/s3dyeh'));
  assert.ok(person.sameAs.includes('https://www.linkedin.com/in/s3dyeh/'));
  const website = graph.find(entity => entity['@type'] === 'WebSite');
  assert.ok(website?.alternateName.includes('s3dyeh'));
  assert.equal(website?.url, canonicalOrigin + '/');
  const page = graph.find(entity => entity['@id'] === canonical + '#page');
  assert.equal(page?.url, canonical);
  assert.equal(page?.about['@id'], person['@id']);
  assert.equal(page?.isPartOf['@id'], website['@id']);
  assert.equal(new Set(graph.map(entity => entity['@id'])).size, graph.length);
  if (path !== '/') {
    assert.ok(!document.querySelector('dialog'), path + ': content available without a dialog');
    const breadcrumbs = graph.find(entity => entity['@type'] === 'BreadcrumbList');
    const crumbs = breadcrumbs?.itemListElement;
    assert.ok(crumbs?.length >= 2);
    assert.equal(crumbs.at(-1).item, canonical);
    assert.ok(document.querySelector('nav[aria-label="Breadcrumb"]'));
    for (const [index, crumb] of crumbs.entries()) assert.equal(crumb.position, index + 1);
  }
  if (path === '/about/') {
    assert.equal(page['@type'], 'ProfilePage');
    assert.equal(page.mainEntity['@id'], person['@id']);
    const headings = [...document.querySelectorAll('h2')].map(item => item.textContent);
    assert.ok(headings.includes('Who is s3dyeh?'));
    assert.ok(headings.includes('Who is Ahmad Sadieh?'));
  }
  if (path === '/') {
    assert.match(document.querySelector('h1').textContent, /Ahmad Sadieh/);
    for (const link of ['/about/', '/expertise/', '/work/']) assert.ok(document.querySelector('main a[href="' + link + '"]'));
  }
  if (path === '/work/') {
    const internalProjects = [...document.querySelectorAll('[data-internal-system="true"]')];
    assert.equal(internalProjects.length, 4);
    for (const project of internalProjects) {
      assert.equal(project.querySelector('a'), null);
      assert.equal(project.querySelector('.internal-badge')?.textContent.trim(), 'Internal system');
    }
    for (const name of ['Jordan Census 2026', 'MODEE', 'EmploGene', 'Anomaly detection', 'Bias detection', 'Duplication detection', 'Sentiment detection', 'Survey & rule builder', 'AI RAG system', 'AI reporting & monitoring']) {
      assert.ok(internalProjects.some(project => project.textContent.includes(name)), name);
    }
    assert.ok(!html.includes('https://emplgene.s3dyeh.com/'));
    for (const name of ['FastAPI', 'LangChain', 'OpenRouter', 'Ragas']) assert.ok(document.querySelector('app-ai-toolkit')?.textContent.includes(name));
    assert.equal(document.querySelectorAll('app-faq details').length, 10);
    assert.equal(document.querySelectorAll('app-certifications a').length, 5);
    assert.ok(document.querySelector('main')?.textContent.includes('Retrieval-augmented generation'));
  }
}

// Crawl actual anchor destinations, including project deep links, without running JavaScript.
const edges = new Map();
for (const [path, document] of documents) {
  edges.set(path, new Set());
  for (const anchor of document.querySelectorAll('a[href]')) {
    const url = new URL(anchor.href);
    if (url.origin !== canonicalOrigin) continue;
    const destination = documents.get(url.pathname);
    assert.ok(destination, path + ': unknown internal page ' + url.pathname);
    edges.get(path).add(url.pathname);
    if (url.hash && url.hash !== '#') assert.ok(destination.getElementById(decodeURIComponent(url.hash.slice(1))), path + ': broken fragment ' + url.href);
  }
}
const reachable = new Set();
function visit(path) {
  if (reachable.has(path)) return;
  reachable.add(path);
  for (const next of edges.get(path)) visit(next);
}
visit('/');
assert.equal(reachable.size, paths.length, 'Every page must be reachable from the homepage');

const sitemap = new JSDOM(await read('/sitemap.xml'), { contentType: 'application/xml' }).window.document;
const sitemapUrls = [...sitemap.querySelectorAll('loc')].map(node => node.textContent);
assert.deepEqual(sitemapUrls.sort(), paths.map(path => canonicalOrigin + path).sort(), 'Sitemap must contain exactly the canonical public pages');
const robots = await read('/robots.txt');
assert.ok(robots.includes('Sitemap: ' + canonicalOrigin + '/sitemap.xml'));
assert.ok(!/^Disallow:\s*\/\s*$/m.test(robots));
const image = await read('/social-preview.png', true);
assert.equal(image.readUInt32BE(16), 1200); assert.equal(image.readUInt32BE(20), 630);

if (liveOrigin) {
  const missing = await fetch(liveOrigin + '/missing-seo-check-20261025/', { signal: AbortSignal.timeout(20000) });
  assert.equal(missing.status, 404, 'Unknown URLs must return a real 404, not the homepage with 200');
  if (liveOrigin === canonicalOrigin) {
    const alias = await fetch('https://s3dyeh.com/about/', { redirect: 'manual', signal: AbortSignal.timeout(20000) });
    assert.ok([301, 308].includes(alias.status), 'Apex domain should permanently redirect');
    assert.equal(new URL(alias.headers.get('location'), 'https://s3dyeh.com').href, canonicalOrigin + '/about/');
  }
} else {
  const missing = new JSDOM(await read('/404.html')).window.document;
  assert.match(missing.querySelector('meta[name="robots"]')?.content || '', /noindex/);
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  assert.equal(config.framework, null, 'Serve the prerendered static output without Angular SPA fallbacks');
  assert.equal(config.outputDirectory, base);
  assert.equal(config.trailingSlash, true);
  assert.ok(!config.rewrites && !config.routes, 'Do not add catch-all homepage rewrites');
}
console.log('SEO checks passed: 7 prerendered pages, identity/alias schema, unique metadata, breadcrumbs, crawlable links and fragments, project evidence, FAQs, sitemap, robots, social image, and ' + (liveOrigin ? 'HTTP 404/redirects.' : 'static hosting configuration.'));
