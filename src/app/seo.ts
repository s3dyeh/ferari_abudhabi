import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export const SITE_URL = 'https://s3dyeh.com';
const person = {
  '@type': 'Person', '@id': `${SITE_URL}/#ahmad`, name: 'Ahmad Sadieh',
  url: SITE_URL + '/', jobTitle: 'Full-Stack & AI Engineer', email: 'mailto:s3dyeh00@gmail.com',
  sameAs: ['https://www.linkedin.com/in/s3dyeh/', 'https://github.com/s3dyeh', 'https://www.instagram.com/s3dyeh/', 'https://www.facebook.com/s3dyeh'],
  knowsAbout: ['Angular', 'Node.js', 'TypeScript', 'Oracle', 'PostgreSQL', 'REST APIs', 'Large language models', 'Retrieval-augmented generation', 'AI agents'],
};
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  setPage(work = false): void {
    const url = SITE_URL + (work ? '/work/' : '/');
    const title = work ? 'AI Development, RAG & Full-Stack Engineering | Ahmad Sadieh' : 'Ahmad Sadieh | Full-Stack & AI Engineer';
    const description = work
      ? 'Explore Ahmad Sadieh’s AI and full-stack work: LLM integration, RAG, agents, FastAPI, LangChain, OpenRouter, Ragas, Angular, and Node.js.'
      : 'Ahmad Sadieh builds and improves production web applications with Angular, Node.js, Oracle, and PostgreSQL. Explore practical AI, LLM, and RAG integrations.';
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    let canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = this.document.createElement('link'); canonical.rel = 'canonical'; this.document.head.appendChild(canonical); }
    canonical.href = url;
    let schema = this.document.getElementById('site-schema');
    if (!schema) { schema = this.document.createElement('script'); schema.id = 'site-schema'; schema.setAttribute('type', 'application/ld+json'); this.document.head.appendChild(schema); }
    schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': [person,
      { '@type': 'WebSite', '@id': SITE_URL + '/#website', url: SITE_URL + '/', name: 'Ahmad Sadieh', inLanguage: 'en', publisher: { '@id': SITE_URL + '/#ahmad' } },
      { '@type': work ? 'ProfilePage' : 'WebPage', '@id': url + '#page', url, name: title, description, inLanguage: 'en', isPartOf: { '@id': SITE_URL + '/#website' }, mainEntity: { '@id': SITE_URL + '/#ahmad' } },
    ] }).replace(/</g, '\u003c');
  }
}
