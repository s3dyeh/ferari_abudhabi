// Public identity and page content shared by prerendering and the browser.
// Use the host production already redirects to; canonical URLs must resolve directly.
export const SITE_URL = 'https://www.s3dyeh.com';
export const PROFILE_LINKS = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/s3dyeh/' },
  { label: 'GitHub', url: 'https://github.com/s3dyeh' },
  { label: 'Instagram', url: 'https://www.instagram.com/s3dyeh/' },
  { label: 'Facebook', url: 'https://www.facebook.com/s3dyeh' },
] as const;

export interface PageMetadata {
  path: string;
  title: string;
  description: string;
  label: string;
  type: 'WebPage' | 'ProfilePage' | 'CollectionPage';
}

interface ContentSection {
  id: string;
  heading: string;
  paragraphs: readonly string[];
  points?: readonly string[];
  links?: readonly { label: string; href: string }[];
}

export interface ContentPage extends PageMetadata {
  eyebrow: string;
  heading: string;
  intro: string;
  sections: readonly ContentSection[];
}

export const HOME_PAGE: PageMetadata = {
  path: '/', label: 'Home', type: 'WebPage',
  title: 'Ahmad Sadieh (s3dyeh) | Software & AI Engineer',
  description: 'Ahmad Sadieh, known as s3dyeh, is a software, full-stack and AI engineer. Explore his Angular, Node.js, RAG and AI agent work, projects and technical expertise.',
};

export const WORK_PAGE: PageMetadata = {
  path: '/work/', label: 'Work', type: 'CollectionPage',
  title: 'Projects & Engineering Work | Ahmad Sadieh (s3dyeh)',
  description: 'Explore Ahmad Sadieh’s (s3dyeh) software and AI projects: FarasJo, Veasyo, Hydrogen, enterprise integrations, RAG systems, services and certifications.',
};

export const ABOUT_PAGE: ContentPage = {
  path: '/about/', label: 'About', type: 'ProfilePage',
  title: 'Who is Ahmad Sadieh (s3dyeh)? | About the Engineer',
  description: 'Meet Ahmad Sadieh, also known as s3dyeh: a software, full-stack and AI engineer building web applications, enterprise integrations, RAG systems and AI agents.',
  eyebrow: 'The person behind the work',
  heading: 'Ahmad Sadieh, also known as s3dyeh.',
  intro: 'I’m Ahmad Sadieh, a software engineer and Full-Stack & AI Engineer. I build, improve and troubleshoot production web applications and enterprise systems. Online, I use the nickname s3dyeh.',
  sections: [
    {
      id: 'who-is-s3dyeh', heading: 'Who is s3dyeh?',
      paragraphs: ['s3dyeh is the online nickname of Ahmad Sadieh. It is the handle I use on GitHub, LinkedIn, Instagram and Facebook, and the name behind s3dyeh.com. This website brings together my engineering work, technical interests and public profiles.'],
      links: PROFILE_LINKS.map(link => ({ label: `Ahmad Sadieh on ${link.label}`, href: link.url })),
    },
    {
      id: 'who-is-ahmad-sadieh', heading: 'Who is Ahmad Sadieh?',
      paragraphs: [
        'I’m a Computer Engineer working across frontend development, backend systems, databases and AI integration. My work includes building new products and understanding existing systems well enough to fix the right problem.',
        'My core stack includes Angular, TypeScript, Node.js, NestJS, Express, Oracle and PostgreSQL. I connect applications through REST APIs and work with authentication, authorization, Docker and Google Cloud. For AI features, I work with large language models, retrieval-augmented generation (RAG), knowledge assistants and AI agents.',
      ],
      links: [{ label: 'Explore my engineering expertise', href: '/expertise/' }],
    },
    {
      id: 'projects', heading: 'What has Ahmad Sadieh built?',
      paragraphs: [
        'For FarasJo, I designed, built and deployed a bilingual equestrian platform with Arabic and English interfaces, search, authentication, media management and REST APIs. Veasyo connects restaurant administration, waiter workflows and customer service requests in a SaaS product.',
        'My portfolio also includes full-stack work for Hydrogen and Fluentia Academy, backend and access-control work for EmploGene, and internal enterprise integrations. An internal AI and data-quality platform brought together detection workflows, a survey and rule builder, retrieval and reporting.',
        'The project entries describe my contribution and link to public products where available. Internal systems are described at a high level and have no public application links.',
      ],
      links: [{ label: 'Read the project portfolio', href: '/work/#selected-work' }],
    },
    {
      id: 'approach', heading: 'How I approach an engineering problem',
      paragraphs: ['I start with the current behavior, architecture and data flow. That helps separate an interface issue from an API, database or integration problem. I care about maintainable code, clear boundaries, performance and security, with changes that can be checked against the original problem.'],
      links: [{ label: 'View technical certifications', href: '/work/#certifications' }],
    },
    {
      id: 'contact', heading: 'How can I contact Ahmad Sadieh?',
      paragraphs: ['Email s3dyeh00@gmail.com with the problem, the current state of your project and the outcome you need. A short description of the application, stack and constraints is a useful place to start.'],
      links: [{ label: 'Email Ahmad Sadieh', href: 'mailto:s3dyeh00@gmail.com' }],
    },
  ],
};

export const EXPERTISE_PAGES: readonly ContentPage[] = [
  {
    path: '/expertise/angular-nodejs/', label: 'Angular & Node.js', type: 'WebPage',
    title: 'Angular & Node.js Development | Ahmad Sadieh (s3dyeh)',
    description: 'Angular, TypeScript and Node.js development by Ahmad Sadieh (s3dyeh): application debugging, NestJS and Express APIs, authentication and production delivery.',
    eyebrow: 'Full-stack engineering', heading: 'Angular interfaces. Node.js systems. Connected end to end.',
    intro: 'I’m Ahmad Sadieh (s3dyeh). I build and improve web applications across the interface, API and database, with Angular and TypeScript on the frontend and Node.js, NestJS or Express on the backend.',
    sections: [
      {
        id: 'angular', heading: 'Angular development and modernization',
        paragraphs: ['An existing Angular application often needs careful changes across components, state and API calls. I investigate the behavior users see, trace how data reaches the interface and work within the application’s architecture before proposing a change.'],
        points: ['Build responsive interfaces connected to backend workflows.', 'Debug application behavior and integration failures.', 'Modernize existing code while preserving required behavior.'],
      },
      {
        id: 'nodejs', heading: 'Node.js, NestJS and Express backends',
        paragraphs: ['The backend is where application rules, persistence and integrations meet. My work covers REST API design, database integration, authentication and authorization. JWT and role-based access control help express who can access a workflow and what they can do within it.', 'For a feature that crosses several layers, I trace the complete request from the interface through the API to the stored data. This is also how I investigate slow requests and failures that appear far from their cause.'],
        links: [{ label: 'Database and API performance work', href: '/expertise/database-api-performance/' }],
      },
      {
        id: 'project-evidence', heading: 'Related project experience',
        paragraphs: ['FarasJo combines a Next.js and TypeScript frontend with NestJS, PostgreSQL, Prisma and Typesense. My contribution included architecture, database design, deployment and maintenance, with Arabic and English support.', 'For EmploGene, I worked on backend APIs, the PostgreSQL data model, authentication, role-based access and responsive interfaces for employee and task management. These projects show the system boundaries I work across; each portfolio entry lists its own technologies.'],
        links: [{ label: 'FarasJo: bilingual platform', href: '/work/#farasjo' }, { label: 'EmploGene: workforce workflows', href: '/work/#emplogene' }],
      },
      {
        id: 'delivery', heading: 'From the codebase to production',
        paragraphs: ['My delivery work includes Docker, Google Cloud and deployment preparation. For an existing product, the first step is to establish what already works, what blocks release and how a change will be verified. For a new feature, I connect the user workflow to the API and data it needs.'],
        links: [{ label: 'Angular, JavaScript and API certifications', href: '/work/#certifications' }],
      },
    ],
  },
  {
    path: '/expertise/ai-rag-agents/', label: 'AI, RAG & agents', type: 'WebPage',
    title: 'AI Integration, RAG & AI Agents | Ahmad Sadieh (s3dyeh)',
    description: 'Ahmad Sadieh (s3dyeh) integrates LLMs, RAG, knowledge assistants and AI agents into applications, with FastAPI, LangChain, OpenRouter and Ragas in his toolkit.',
    eyebrow: 'Practical AI integration', heading: 'AI connected to the knowledge and workflows that matter.',
    intro: 'I’m Ahmad Sadieh (s3dyeh). I integrate large language models, retrieval-augmented generation and AI agents into existing products, connecting the AI feature to the data and systems it needs to be useful.',
    sections: [
      {
        id: 'rag', heading: 'What is retrieval-augmented generation?',
        paragraphs: ['Retrieval-augmented generation, or RAG, retrieves relevant information from a knowledge source and gives it to a language model as context. It is useful for assistants that need to answer questions about documents or business information.', 'A RAG system needs more than a model connection. The retrieved material must be relevant, access must match the user’s permissions, and answers need evaluation. Retrieval can improve the context available to a model, but it does not guarantee that every generated answer is correct.'],
      },
      {
        id: 'agents', heading: 'LLM integration and AI agents',
        paragraphs: ['A knowledge assistant answers questions; an agent can also coordinate tools and steps in a workflow. I work on connecting these capabilities to application APIs and enterprise systems. The design depends on the task, the available data and the actions the system is allowed to take.'],
        points: ['Knowledge-based assistants grounded in relevant information.', 'AI workflows integrated with existing application behavior.', 'Clear access boundaries and evaluation of the resulting output.'],
      },
      {
        id: 'toolkit', heading: 'FastAPI, LangChain, OpenRouter and Ragas',
        paragraphs: ['My AI toolkit includes FastAPI for Python APIs, LangChain for retrieval and agent workflows, OpenRouter for model access, and Ragas for RAG evaluation. I choose the pieces around the application’s requirements and its existing infrastructure.', 'Useful evaluation starts with the questions and tasks the application needs to handle. Retrieval quality and generated-answer quality are separate things to check, especially when the assistant uses internal knowledge.'],
        links: [{ label: 'Explore the AI toolkit in my portfolio', href: '/work/#ai-toolkit' }],
      },
      {
        id: 'project-evidence', heading: 'Internal AI and data-quality integration',
        paragraphs: ['I implemented the backend and full AI integration for an internal AI and data-quality platform. The scope included anomaly, bias, duplication and sentiment detection alongside a configurable survey and rule builder.', 'The platform also connected an AI RAG system with reporting and monitoring workflows. My portfolio describes the engineering scope of this internal system without exposing its application or private data.'],
        links: [{ label: 'Read the AI and data-quality project', href: '/work/#ai-data-quality' }],
      },
    ],
  },
  {
    path: '/expertise/database-api-performance/', label: 'Databases & APIs', type: 'WebPage',
    title: 'Oracle, PostgreSQL & API Performance | Ahmad Sadieh (s3dyeh)',
    description: 'Oracle, PostgreSQL and REST API work by Ahmad Sadieh (s3dyeh): query investigation, backend integrations, authentication and application performance debugging.',
    eyebrow: 'Backend reliability', heading: 'Trace the request. Understand the data. Fix the bottleneck.',
    intro: 'I’m Ahmad Sadieh (s3dyeh). I investigate slow APIs, expensive database queries and integration issues across the application stack, with Oracle and PostgreSQL as part of my core database work.',
    sections: [
      {
        id: 'diagnosis', heading: 'How I investigate a slow API',
        paragraphs: ['The delay visible in an interface can originate in a network request, application logic, a database query or a connected service. I start by reproducing the slow workflow and tracing the request across those boundaries before selecting an optimization.', 'The purpose is to identify the part that actually controls the response time. A change should then be checked against the same workflow and representative data, while keeping the required behavior intact.'],
      },
      {
        id: 'databases', heading: 'Oracle and PostgreSQL integration',
        paragraphs: ['Database work includes connecting application workflows to a coherent data model and investigating how queries behave under the application’s access patterns. Schema relationships, filtering and the data returned by an API all affect how the product behaves.', 'In EmploGene, an interconnected PostgreSQL model supports employee, task and organizational workflows. FarasJo uses PostgreSQL with Prisma alongside Typesense search. These are examples of data systems serving distinct product requirements.'],
        links: [{ label: 'EmploGene project scope', href: '/work/#emplogene' }, { label: 'FarasJo architecture and stack', href: '/work/#farasjo' }],
      },
      {
        id: 'integrations', heading: 'REST APIs and enterprise integrations',
        paragraphs: ['I design and integrate REST APIs that connect interfaces, backend services and external systems. Authentication, authorization and the handling of integration failures are part of that work.', 'My internal-system experience includes backend work on Jordan Census 2026, SSC–Sanad integration and QR report validation with MODEE. The portfolio records those contributions at the workflow level; it does not provide public access to the systems.'],
        links: [{ label: 'SSC, Sanad and MODEE integration work', href: '/work/#ssc-integrations' }, { label: 'Jordan Census backend contribution', href: '/work/#jordan-census' }],
      },
      {
        id: 'starting-point', heading: 'A useful starting point for troubleshooting',
        paragraphs: ['Describe the affected workflow, the behavior you expected and the behavior you see. Include the stack and whether the issue happens consistently or only under particular conditions. That gives us a concrete starting point for investigation without guessing at a solution.'],
        links: [{ label: 'Full-stack application development', href: '/expertise/angular-nodejs/' }],
      },
    ],
  },
];

export const EXPERTISE_PAGE: ContentPage = {
  path: '/expertise/', label: 'Expertise', type: 'CollectionPage',
  title: 'Software & AI Engineering Expertise | Ahmad Sadieh (s3dyeh)',
  description: 'Explore Ahmad Sadieh’s (s3dyeh) technical expertise: Angular and Node.js applications, AI and RAG integration, Oracle, PostgreSQL, APIs and production debugging.',
  eyebrow: 'What I work on', heading: 'Engineering across the whole system.',
  intro: 'I’m Ahmad Sadieh (s3dyeh), a software, full-stack and AI engineer. My work connects interfaces, backend services, databases and AI capabilities. Explore the areas below for my approach and related project experience.',
  sections: [
    {
      id: 'full-stack', heading: 'Angular, TypeScript and Node.js applications',
      paragraphs: ['I build and improve frontend and backend applications, including existing codebases that need debugging or modernization. My core stack includes Angular, TypeScript, Node.js, NestJS and Express, supported by REST APIs, authentication and role-based access.'],
      links: [{ label: 'Explore Angular and Node.js development', href: '/expertise/angular-nodejs/' }],
    },
    {
      id: 'ai', heading: 'LLMs, RAG and AI agents',
      paragraphs: ['I integrate AI capabilities into products and enterprise workflows, including knowledge assistants, retrieval-augmented generation and agents. My toolkit includes FastAPI, LangChain, OpenRouter and Ragas, with attention to the application’s data, access requirements and evaluation.'],
      links: [{ label: 'Explore AI, RAG and agent integration', href: '/expertise/ai-rag-agents/' }],
    },
    {
      id: 'backend', heading: 'Oracle, PostgreSQL and REST API performance',
      paragraphs: ['I trace slow APIs, expensive queries and integration problems across the frontend, backend and database. The work starts with understanding the existing architecture and the affected workflow, then making a focused change and checking the result.'],
      links: [{ label: 'Explore database and API engineering', href: '/expertise/database-api-performance/' }],
    },
    {
      id: 'production', heading: 'Deployment and production preparation',
      paragraphs: ['Docker, Google Cloud, authentication and authorization are part of carrying an application toward production. My project work includes deployment and maintenance as well as feature development, with attention to maintainability and clear architecture.'],
      links: [{ label: 'See projects and technical certifications', href: '/work/' }],
    },
  ],
};

export const CONTENT_PAGES: readonly ContentPage[] = [ABOUT_PAGE, EXPERTISE_PAGE, ...EXPERTISE_PAGES];
