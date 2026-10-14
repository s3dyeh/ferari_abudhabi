import { Component } from '@angular/core';
import { ArrowIcon } from '../arrow-icon';

@Component({
  selector: 'app-profile-overview',
  template: `<div class="profile-heading">
    <p class="title">Full-Stack &amp; AI Engineer <span>| LLM, RAG &amp; AI agents | Angular &amp; Node.js</span></p>
  </div>
  <p>I’m a Full-Stack &amp; AI Engineer specializing in building, improving, and troubleshooting production-grade web applications and enterprise systems.</p>
  <p>My core stack includes Angular, Node.js, TypeScript, NestJS/Express, Oracle, PostgreSQL, REST APIs, Docker, and Google Cloud. I also build and integrate AI/LLM capabilities into existing products, including RAG systems, AI agents, intelligent workflows, and enterprise AI integrations.</p>`,
  styles: `:host { display: block; margin-top: 30px; }
    .profile-heading { display: flex; align-items: start; justify-content: space-between; gap: 24px; }
    .title { color: var(--ink); font-size: 18px; line-height: 1.6; margin: 0; }
    .title span { display: block; font-size: 13px; color: var(--muted); }
    p { color: var(--muted); font-size: 16px; line-height: 1.8; }
    @media(max-width:500px) { .profile-heading { flex-direction: column; gap: 16px; } }`,
})
export class ProfileOverview {}

@Component({
  selector: 'app-professional-details',
  imports: [ArrowIcon],
  template: `<section id="services" aria-labelledby="services-title">
    <p class="eyebrow">Build. Fix. Improve.</p>
    <h2 id="services-title">Where I can help</h2>
    <ul class="services">
      @for (service of services; track service) {
        <li><span class="marker" aria-hidden="true"></span>{{ service }}</li>
      }
    </ul>
    <div class="approach">
      <h2>Understand the system.<br />Solve the right problem.</h2>
      <div>
        <p>I’m comfortable working with existing codebases, including complex systems where the problem is not immediately obvious. I can investigate the application, understand the architecture and data flow, identify the root cause, and implement a practical solution without unnecessarily rebuilding the entire system.</p>
        <p>My background as a Computer Engineer also gives me a broader understanding of software architecture, infrastructure, automation, cloud systems, and how different components interact beyond the application layer.</p>
        <p>I care about maintainable code, clear architecture, performance, security, and delivering solutions that work in real production environments.</p>
      </div>
    </div>
    <div class="contact">
      <p>If you have an existing system that needs to be built, fixed, optimized, modernized, integrated with AI, or prepared for production, send me the problem and the current state of the project. I’ll help you determine the most practical way forward.</p>
      <a href="mailto:s3dyeh00@gmail.com?subject=Let%27s%20discuss%20my%20project">Let’s discuss your project <app-arrow-icon /></a>
      <span>s3dyeh00@gmail.com</span>
    </div>
  </section>`,
  styles: `:host { display: block; margin-top: 64px; }
    section { padding-top: 40px; border-top: 1px solid var(--line); }
    .eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: .13em; color: var(--accent); }
    h2 { font-size: clamp(24px, 3vw, 34px); line-height: 1.2; letter-spacing: -.035em; font-weight: 450; margin: 14px 0 28px; text-wrap: balance; }
    .services { display: grid; grid-template-columns: 1fr 1fr; gap: 0 40px; padding: 0; list-style: none; }
    li { display: flex; align-items: baseline; gap: 14px; padding: 18px 0; border-bottom: 1px solid var(--line); font-size: 14px; line-height: 1.7; }
    .marker { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; flex: none; }
    .approach { display: grid; grid-template-columns: .9fr 1.2fr; gap: 44px; padding: 40px 0 24px; }
    p { font-size: 15px; line-height: 1.85; color: var(--muted); }
    .contact { background: var(--surface); padding: clamp(24px, 4vw, 40px); border-radius: 12px; }
    .contact p { max-width: 780px; margin-top: 0; }
    a { display: inline-flex; gap: 16px; align-items: center; min-height: 48px; color: var(--paper); background: var(--ink); border-radius: 30px; text-decoration: none; padding: 12px 22px; font-size: 14px; }
    a:hover { background: var(--accent); }
    .contact > span { display: block; margin-top: 16px; font-size: 12px; color: var(--muted); overflow-wrap: anywhere; }
    @media(max-width:650px) { .services, .approach { grid-template-columns: 1fr; } .approach { gap: 0; } }
  `,
})
export class ProfessionalDetails {
  readonly services = [
    'AI/LLM integration into existing applications',
    'RAG pipelines, AI agents, and knowledge-based assistants',
    'Angular application development, debugging, and modernization',
    'Node.js, NestJS, and Express backend development',
    'REST API design, development, and third-party integrations',
    'Oracle and PostgreSQL database integration and performance optimization',
    'Debugging slow APIs, queries, and application bottlenecks',
    'Docker, deployment, and cloud infrastructure',
    'Authentication, authorization, JWT, and role-based access control',
    'Legacy application modernization and technical troubleshooting',
    'Taking prototypes and incomplete systems toward production-ready implementations',
  ];
}
