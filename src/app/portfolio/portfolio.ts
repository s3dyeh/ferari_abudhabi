import { AiToolkit } from './ai-toolkit';
import { EngineeringSignature } from './engineering-signature';
import { Faq } from './faq';
import { ProfileOverview, ProfessionalDetails } from './professional-profile';
import { Certifications } from './certifications';
import { SocialLinks } from '../social-links';
import { IntelligenceStory } from '../intelligence-story';
import { ArrowIcon } from '../arrow-icon';
import { AmmanTheme } from '../clock/amman-theme';
import { Component, ElementRef, inject, input, output } from '@angular/core';
import { PROJECTS } from './portfolio.data';

@Component({
  imports: [AiToolkit, ArrowIcon, SocialLinks, IntelligenceStory, ProfileOverview, ProfessionalDetails, Certifications, Faq, EngineeringSignature],
  selector: 'app-portfolio',
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
})
export class Portfolio {
  readonly standalonePage = input(false);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  goToSection(event: Event, id: string): void {
    const section = this.host.nativeElement.querySelector<HTMLElement>(`#${id}`);
    const scroll = this.host.nativeElement.querySelector<HTMLElement>('.portfolio-scroll');
    if (section && scroll) {
      event.preventDefault();
      scroll.scrollTop += section.getBoundingClientRect().top - scroll.getBoundingClientRect().top;
    }
  }
  readonly theme = inject(AmmanTheme);
  readonly projects = PROJECTS;
  readonly dismissed = output<void>();
}
