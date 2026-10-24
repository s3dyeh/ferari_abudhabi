import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AmmanTheme } from './clock/amman-theme';
import { Seo } from './seo';
import { EXPERTISE_PAGES, type ContentPage as ContentPageData } from './site-content';
import { SocialLinks } from './social-links';

@Component({
  selector: 'app-content-page',
  imports: [SocialLinks],
  templateUrl: './content-page.html',
  styleUrl: './content-page.scss',
})
export class ContentPage {
  readonly theme = inject(AmmanTheme);
  readonly page = inject(ActivatedRoute).snapshot.data['page'] as ContentPageData;
  readonly expertise = EXPERTISE_PAGES;
  readonly isSpecialty = this.page.path.startsWith('/expertise/') && this.page.path !== '/expertise/';

  constructor() { inject(Seo).setPage(this.page); }
}
