import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HOME_PAGE, PROFILE_LINKS, SITE_URL, type PageMetadata } from './site-content';

const personId = SITE_URL + '/#ahmad';
const websiteId = SITE_URL + '/#website';
const person = {
  '@type': 'Person', '@id': personId,
  name: 'Ahmad Sadieh', alternateName: 's3dyeh',
  url: SITE_URL + '/about/', mainEntityOfPage: SITE_URL + '/about/#page',
  jobTitle: 'Full-Stack & AI Engineer', email: 'mailto:s3dyeh00@gmail.com',
  description: 'Ahmad Sadieh, also known as s3dyeh, is a software, full-stack and AI engineer who builds, improves and troubleshoots web applications and enterprise systems.',
  sameAs: PROFILE_LINKS.map(link => link.url),
  knowsAbout: ['Software engineering', 'Angular', 'TypeScript', 'Node.js', 'NestJS', 'Express',
    'Oracle', 'PostgreSQL', 'REST APIs', 'Large language models',
    'Retrieval-augmented generation', 'AI agents', 'FastAPI', 'LangChain', 'OpenRouter',
    'Ragas', 'Docker', 'Google Cloud'],
};

@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  setPage(page: PageMetadata = HOME_PAGE): void {
    const url = SITE_URL + page.path;
    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:site_name', content: 'Ahmad Sadieh (s3dyeh)' });
    this.meta.updateTag({ name: 'twitter:title', content: page.title });
    this.meta.updateTag({ name: 'twitter:description', content: page.description });
    let canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }
    canonical.href = url;
    let schema = this.document.getElementById('site-schema');
    if (!schema) {
      schema = this.document.createElement('script');
      schema.id = 'site-schema';
      schema.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(schema);
    }
    const breadcrumbs = [{ name: 'Home', item: SITE_URL + '/' }];
    if (page.path.startsWith('/expertise/') && page.path !== '/expertise/') {
      breadcrumbs.push({ name: 'Expertise', item: SITE_URL + '/expertise/' });
    }
    if (page.path !== '/') breadcrumbs.push({ name: page.label, item: url });
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        person,
        {
          '@type': 'WebSite', '@id': websiteId, url: SITE_URL + '/',
          name: 'Ahmad Sadieh', alternateName: ['s3dyeh', 'Ahmad Sadieh (s3dyeh)'],
          inLanguage: 'en', publisher: { '@id': personId },
        },
        {
          '@type': page.type, '@id': url + '#page', url, name: page.title,
          description: page.description, inLanguage: 'en',
          isPartOf: { '@id': websiteId }, about: { '@id': personId }, author: { '@id': personId },
          ...(page.type === 'ProfilePage' || page.path === '/' ? { mainEntity: { '@id': personId } } : {}),
          ...(page.path !== '/' ? { breadcrumb: { '@id': url + '#breadcrumbs' } } : {}),
        },
        ...(page.path === '/' ? [] : [{
          '@type': 'BreadcrumbList', '@id': url + '#breadcrumbs',
          itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem', position: index + 1, name: crumb.name, item: crumb.item,
          })),
        }]),
      ],
    }).replace(/</g, '\\u003c');
  }
}
