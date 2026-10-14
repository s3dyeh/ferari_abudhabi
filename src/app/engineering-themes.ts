/** Shared by the decorative word cycle and the readable, prerendered portfolio. */
export const ENGINEERING_THEMES = [
  { name: 'Interfaces', phrase: 'Build with intention.', keywords: ['Angular', 'TypeScript', 'Responsive UI'], description: 'Build and modernize interfaces around the people using them, including bilingual experiences and right-to-left layouts.' },
  { name: 'Connected systems', phrase: 'Connect the pieces.', keywords: ['Node.js', 'NestJS / Express', 'REST APIs'], description: 'Connect frontend workflows, backend services, and third-party integrations through clear application boundaries.' },
  { name: 'Data & performance', phrase: 'Find the bottleneck.', keywords: ['Oracle', 'PostgreSQL', 'Query optimization'], description: 'Follow slow requests through the application and database to identify where time is being spent.' },
  { name: 'Practical intelligence', phrase: 'Give knowledge a purpose.', keywords: ['LLM integration', 'RAG pipelines', 'AI agents'], description: 'Connect models to relevant knowledge and existing workflows so AI can help with a specific, practical problem.' },
  { name: 'Production', phrase: 'Carry the idea further.', keywords: ['Docker', 'Google Cloud', 'Deployment'], description: 'Take prototypes and incomplete applications toward production with attention to configuration, delivery, and maintainability.' },
  { name: 'Problem solving', phrase: 'Find the connection.', keywords: ['Root-cause analysis', 'Authentication', 'Architecture'], description: 'Understand unfamiliar codebases, trace their data flow, and solve the underlying issue without unnecessary rebuilding.' },
] as const;
