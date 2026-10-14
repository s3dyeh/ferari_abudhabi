import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const base = 'dist/Animator/browser';
for (const [file, canonical] of [['index.html', 'https://s3dyeh.com/'], ['work/index.html', 'https://s3dyeh.com/work/']]) {
  const html = await readFile(`${base}/${file}`, 'utf8');
  const document = new JSDOM(html).window.document;
  assert.equal(document.querySelector('link[rel="canonical"]')?.href, canonical);
  assert.equal(document.querySelector('meta[property="og:url"]')?.content, canonical);
  assert.equal(document.querySelector('meta[property="og:image"]')?.content, 'https://s3dyeh.com/social-preview.png');
  assert.ok(document.title.includes('Ahmad Sadieh'));
  assert.ok(document.querySelector('meta[name="description"]')?.content.length > 80);
  assert.ok(!html.includes('$25.00'));
  const graph = JSON.parse(document.querySelector('#site-schema')?.textContent)['@graph'];
  assert.ok(graph.some(entity => entity['@type'] === 'Person' && entity.name === 'Ahmad Sadieh'));
  if (file.startsWith('work/')) {
    assert.equal(document.querySelectorAll('h1').length, 1);
    const internalProjects = [...document.querySelectorAll('[data-internal-system="true"]')];
    assert.equal(internalProjects.length, 4);
    for (const project of internalProjects) {
      assert.equal(project.querySelector('a'), null);
      assert.equal(project.querySelector('.internal-badge')?.textContent.trim(), 'Internal system');
    }
    assert.ok(internalProjects.some(project => project.textContent.includes('Jordan Census 2026')));
    assert.ok(internalProjects.some(project => project.textContent.includes('MODEE')));
    assert.ok(internalProjects.some(project => project.textContent.includes('EmploGene')));
    assert.ok(!html.includes('https://emplgene.s3dyeh.com/'));
    for (const capability of ['Anomaly detection', 'Bias detection', 'Duplication detection', 'Sentiment detection', 'Survey & rule builder', 'AI RAG system', 'AI reporting & monitoring']) {
      assert.ok(internalProjects.some(project => project.textContent.includes(capability)));
    }
    for (const name of ['FastAPI', 'LangChain', 'OpenRouter', 'Ragas']) {
      assert.ok(document.querySelector('app-ai-toolkit')?.textContent.includes(name));
    }
    assert.equal(document.querySelectorAll('app-faq details').length, 8);
    assert.equal(document.querySelector('.section-nav a:last-child')?.getAttribute('href'), '/work/#faq');
    assert.equal(document.querySelectorAll('app-certifications a').length, 5);
    assert.ok(document.querySelector('main')?.textContent.includes('Retrieval-augmented generation'));
    assert.ok(!document.querySelector('dialog'));
    assert.ok(graph.some(entity => entity['@type'] === 'ProfilePage'));
  } else {
    assert.ok(document.querySelector('a[href="/work/"]'));
  }
}
const sitemap = await readFile(`${base}/sitemap.xml`, 'utf8');
assert.ok(sitemap.includes('https://s3dyeh.com/work/'));
const robots = await readFile(`${base}/robots.txt`, 'utf8');
assert.ok(robots.includes('Sitemap: https://s3dyeh.com/sitemap.xml'));
const image = await readFile(`${base}/social-preview.png`);
assert.equal(image.readUInt32BE(16), 1200);
assert.equal(image.readUInt32BE(20), 630);
console.log('SEO checks passed: prerendered pages, metadata, schema, FAQs, certificates, sitemap, robots, and social image.');
