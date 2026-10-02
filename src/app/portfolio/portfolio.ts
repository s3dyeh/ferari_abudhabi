import { Component, output } from '@angular/core';
import { EXPERTISE, PROJECTS } from './portfolio.data';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
})
export class Portfolio {
  readonly projects = PROJECTS;
  readonly expertise = EXPERTISE;
  readonly dismissed = output<void>();
}
