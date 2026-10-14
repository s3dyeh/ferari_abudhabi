export interface Project {
  name: string;
  category: string;
  summary: string;
  contribution: string;
  detail: string;
  technologies: readonly string[];
  links: readonly { label: string; url: string }[];
  internalSystem?: boolean;
  role?: string;
  wordmark?: string;
  capabilities?: readonly string[];
  image?: string;
  imageAlt?: string;
  tone: string;
}

export const PROJECTS: readonly Project[] = [
  {
    name: 'Internal AI & Data Quality Platform',
    wordmark: 'AI & Data Quality',
    category: 'Enterprise AI & data quality',
    role: 'Backend & AI integration',
    internalSystem: true,
    tone: 'charcoal',
    summary: 'Integrated intelligence across data quality, surveys, and reporting.',
    contribution: 'Implemented the backend and full AI integration for an internal platform, bringing data-quality checks, configurable surveys and rules, knowledge retrieval, and reporting monitoring into connected workflows.',
    detail: 'Integrated a data-quality module covering anomaly detection, bias detection, duplication detection, and sentiment detection, alongside a survey and rule builder, an AI RAG system, and an AI reporting and monitoring system.',
    capabilities: [
      'Anomaly detection: flag unusual data patterns for review.',
      'Bias detection: surface potential bias in data for investigation.',
      'Duplication detection: identify duplicate records.',
      'Sentiment detection: analyze sentiment in text responses.',
      'Survey & rule builder: configure surveys and data-quality rules.',
      'AI RAG system: retrieve relevant internal knowledge to support generated answers.',
      'AI reporting & monitoring: integrate reporting and monitoring workflows.',
    ],
    technologies: ['Backend development', 'AI integration', 'Data quality', 'RAG', 'Survey & rule builder', 'Reporting & monitoring'],
    links: [],
  },
  {
    name: 'Jordan Census 2026',
    wordmark: 'Jordan Census 2026',
    category: 'Census systems',
    role: 'Backend development',
    internalSystem: true,
    tone: 'olive',
    summary: 'Backend engineering for internal census workflows.',
    contribution: 'Worked on backend development for the Jordan Census 2026 internal system.',
    detail: 'Contributed to the backend application layer supporting the census system. This portfolio entry describes my engineering contribution to an internal system.',
    technologies: ['Backend development', 'Internal systems', 'Census workflows'],
    links: [],
  },
  {
    name: 'SSC / Sanad & MODEE Integrations',
    wordmark: 'SSC Integrations',
    category: 'Government system integrations',
    role: 'Backend development & integration',
    internalSystem: true,
    tone: 'charcoal',
    summary: 'Connected services and verifiable reports.',
    contribution: 'Implemented backend integration work connecting SSC with Sanad, alongside QR report validation with MODEE.',
    detail: 'Backend work across the SSC–Sanad integration and the MODEE QR report-validation workflow, connecting the participating systems and handling report-validation requests.',
    capabilities: ['SSC–Sanad backend integration.', 'QR-based report validation with MODEE.'],
    technologies: ['Backend integration', 'Sanad', 'QR report validation', 'MODEE'],
    links: [],
  },
  {
    name: 'FarasJo',
    category: 'Equestrian platform',
    tone: 'olive',
    summary: 'An equestrian community. A complete bilingual platform.',
    contribution:
      'Designed, built, and deployed a bilingual equestrian platform end-to-end, from architecture and database design to production maintenance.',
    detail:
      'Arabic and English with RTL support, Typesense search, authentication, media management, and REST APIs.',
    technologies: ['Next.js', 'TypeScript', 'NestJS', 'PostgreSQL', 'Prisma', 'Typesense'],
    image: '/projects/farasjo.webp',
    imageAlt: 'FarasJo’s Arabic homepage featuring its equestrian directory and horse imagery.',
    links: [{ label: 'Visit FarasJo', url: 'https://www.farasjo.com/' }],
  },
  {
    name: 'Veasyo',
    category: 'Restaurant SaaS',
    tone: 'terracotta',
    summary: 'From a table request to a connected operation.',
    contribution:
      'Built a full SaaS platform connecting restaurant administration, waiter workflows, and customer service requests.',
    detail:
      'Table and staff management, QR generation, tenant branding, integrations, analytics, and subscription workflows in one product.',
    technologies: ['Multi-tenant SaaS', 'Admin & waiter workflows', 'QR service requests'],
    image: '/projects/veasyo-waiter.webp',
    imageAlt: 'Veasyo waiter dashboard separating pending requests from service in progress.',
    links: [{ label: 'Visit Veasyo', url: 'https://veasyo.com/' }],
  },
  {
    name: 'Hydrogen',
    category: 'Fitness & hospitality',
    tone: 'charcoal',
    summary: 'One brand. Training, recovery, and hospitality.',
    contribution:
      'Full-stack development of Hydrogen’s web application, including its Hydro Rest and Hydrogen Lounge experiences.',
    detail:
      'A connected web presence for the main fitness brand and its individual hospitality destinations.',
    image: '/projects/hydrogen.webp',
    imageAlt:
      'Hydrogen’s Arabic homepage for its fitness club, spa, and connected hospitality experiences.',
    technologies: ['Full-stack development', 'Web application'],
    links: [
      { label: 'Visit Hydrogen', url: 'https://www.hydrogenjo.com/ar' },
      { label: 'Hydro Rest', url: 'https://www.hydrogenjo.com/ar/hydro-rest' },
      { label: 'Hydrogen Lounge', url: 'https://www.hydrogenjo.com/ar/hydrogen-lounge' },
    ],
  },
  {
    name: 'Fluentia Academy',
    category: 'Online learning',
    tone: 'blue',
    summary: 'A smoother path to digital education.',
    contribution:
      'Full-stack development of responsive interfaces, backend functionality, data management, and key learning-platform workflows.',
    detail:
      'Accessible, usable learning experiences supported by maintainable application architecture.',
    technologies: ['Full-stack development', 'Learning workflows', 'Responsive UI'],
    image: '/projects/fluentia.webp',
    imageAlt:
      'Fluentia Academy homepage showing English learning options and a placement-test entry point.',
    links: [],
  },
  {
    name: 'EmploGene',
    internalSystem: true,
    category: 'HR & workforce management',
    tone: 'sage',
    summary: 'Complex organizations. Connected workflows.',
    contribution:
      'Architected and developed backend APIs, database structure, authentication, role-based access, and responsive interfaces for employee and task management.',
    detail:
      'An interconnected PostgreSQL data model brings employee, task, and organizational workflows together.',
    technologies: ['PostgreSQL', 'REST APIs', 'Authentication', 'Role-based access'],
    links: [],
  },
];

export const EXPERTISE = [
  {
    title: 'Build with a solid foundation.',
    description:
      'Angular, Node.js, TypeScript, NestJS and Express. REST APIs, Oracle and PostgreSQL. Architecture built around the actual problem.',
  },
  {
    title: 'Find what’s really going wrong.',
    description:
      'Slow APIs, expensive queries, application bottlenecks, and legacy systems. Understand the architecture, trace the cause, and make a practical fix.',
  },
  {
    title: 'Make AI useful in production.',
    description:
      'LLM integrations, RAG pipelines, knowledge assistants, AI agents, and intelligent workflows connected to existing products.',
  },
  {
    title: 'Carry it through to delivery.',
    description:
      'Docker, Google Cloud, deployment, authentication, JWT, and role-based access. Move prototypes and incomplete systems toward production.',
  },
] as const;
