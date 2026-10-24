import { Component, inject } from '@angular/core';
import { Portfolio } from './portfolio/portfolio';
import { Seo } from './seo';
import { WORK_PAGE } from './site-content';
@Component({
  selector: 'app-work-page', imports: [Portfolio],
  template: '<main><app-portfolio [standalonePage]="true"  /></main>',
  styles: ':host, main { display: block; height: 100dvh; background: var(--paper); color: var(--ink); }',
})
export class WorkPage {
  constructor() { inject(Seo).setPage(WORK_PAGE); }
}
