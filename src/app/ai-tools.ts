import { siFastapi, siLangchain, siOpenrouter } from 'simple-icons';

export const AI_TOOLS = [
  { name: 'FastAPI', icon: siFastapi, color: '#54e0cc', background: '#084c48', detail: 'Serve intelligence', next: 'Python APIs & model integration', description: 'The API layer connecting AI features to an application.', url: 'https://fastapi.tiangolo.com/' },
  { name: 'LangChain', icon: siLangchain, color: '#a5e0cd', background: '#183e36', detail: 'Connect knowledge', next: 'Retrieval & agent workflows', description: 'Orchestration for retrieval, model calls, tools, and agent workflows.', url: 'https://www.langchain.com/langchain' },
  { name: 'OpenRouter', icon: siOpenrouter, color: '#c6baff', background: '#39245e', detail: 'Choose the right model', next: 'Model access & routing', description: 'A unified interface for accessing and comparing language models.', url: 'https://openrouter.ai/' },
  // Evaluation symbol; Ragas has no brand mark in the installed icon collection.
  { name: 'Ragas', icon: { path: 'M3 3h2v16h16v2H3zm5 8h3v6H8zm5-5h3v11h-3zm5 3h3v8h-3z' }, color: '#ffbd75', background: '#583416', detail: 'Measure what matters', next: 'RAG quality & evaluation', description: 'Evaluation of retrieval and generated answers, including relevance and faithfulness.', url: 'https://docs.ragas.io/' },
] as const;
