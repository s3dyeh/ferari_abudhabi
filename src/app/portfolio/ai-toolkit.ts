import { Component } from '@angular/core';
import { AI_TOOLS } from '../ai-tools';
@Component({
  selector: 'app-ai-toolkit',
  template: `<section id="ai-toolkit" aria-labelledby="ai-toolkit-title">
    <p class="eyebrow">AI development / From knowledge to useful software</p>
    <h2 id="ai-toolkit-title">Build it. Ground it.<br /><em>Evaluate it.</em></h2>
    <p class="intro">AI development brings together APIs, retrieval, model orchestration, and evaluation. The goal: useful answers and workflows connected to the systems people already use.</p>
    <div class="tools">@for (tool of tools; track tool.name) {
      <a [href]="tool.url" target="_blank" rel="noopener noreferrer" [attr.aria-label]="tool.name + ' documentation (opens in a new tab)'">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path [attr.d]="tool.icon.path" /></svg>
        <h3>{{ tool.name }}</h3><p>{{ tool.description }}</p><span>Explore the tool</span>
      </a>
    }</div>
    <p class="workflow">Documents & data <span>/</span> Embeddings & vector search <span>/</span> RAG & agents <span>/</span> Evaluation & monitoring</p>
  </section>`,
  styles: `:host { display:block; margin: 24px 0 64px; }
    section { border-top:1px solid var(--line); padding-top:36px; }
    .eyebrow { font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--accent); }
    h2 { font-size:clamp(30px,4vw,48px); font-weight:450; letter-spacing:-.045em; line-height:1.1; margin:20px 0; }
    em { color:var(--accent); font-style:normal; }
    .intro { max-width:760px; color:var(--muted); line-height:1.8; }
    .tools { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; margin-top:32px; }
    a { display:block; color:var(--ink); text-decoration:none; border-top:2px solid var(--line); padding:24px 0; }
    a:hover { border-color:var(--accent); } a:focus-visible { outline:2px solid var(--accent); outline-offset:6px; }
    svg { width:32px; height:32px; fill:var(--accent); }
    h3 { font-size:20px; font-weight:550; margin:18px 0 10px; }
    a p { color:var(--muted); line-height:1.7; font-size:14px; }
    a span { color:var(--accent); font-size:12px; }
    .workflow { border-top:1px solid var(--line); padding-top:24px; color:var(--muted); font-size:13px; line-height:2; }
    .workflow span { color:var(--accent); margin:0 10px; }
    @media(max-width:850px) { .tools { grid-template-columns:1fr 1fr; } }
    @media(max-width:450px) { .tools { grid-template-columns:1fr; gap:0; } }
  `,
})
export class AiToolkit { readonly tools = AI_TOOLS; }
