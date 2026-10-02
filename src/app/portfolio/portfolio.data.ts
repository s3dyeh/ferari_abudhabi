export interface Project {
  name: string;
  category: string;
  summary: string;
  contribution: string;
  detail: string;
  technologies: readonly string[];
  links: readonly { label: string; url: string }[];
  image?: string;
  imageAlt?: string;
  tone: string;
}

export const PROJECTS: readonly Project[] = [
  {
    name: 'FarasJo',
    category: 'Equestrian platform',
    tone: 'olive',
    summary: 'An entire equestrian world, connected.',
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
    category: 'HR & workforce management',
    tone: 'sage',
    summary: 'Complex organizations. Connected workflows.',
    contribution:
      'Architected and developed backend APIs, database structure, authentication, role-based access, and responsive interfaces for employee and task management.',
    detail:
      'An interconnected PostgreSQL data model brings employee, task, and organizational workflows together.',
    technologies: ['PostgreSQL', 'REST APIs', 'Authentication', 'Role-based access'],
    links: [{ label: 'Visit EmploGene', url: 'https://emplgene.s3dyeh.com/' }],
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
