/** Public assets (respects Vite `base`, e.g. `/web/` on GitHub Pages). */
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export const profile = {
  name: 'Fahad Ali',
  firstName: 'Fahad',
  lastName: 'Ali',
  title: 'AI Solutions Engineer',
  subtitle: 'Forward Deployed Engineering',
  roles: [
    'AI Solutions Engineer',
    'Forward Deployed Engineer',
    'AI Agents & RAG',
    'Full-Stack Systems',
  ],
  tagline:
    '8+ years building scalable web, SaaS, and AI solutions — from architecture through production — with Laravel, Node.js, React, and agentic systems.',
  footerLine: 'AI Solutions Engineer · Forward Deployed Engineering',
  topSkills: ['DevOps', 'Software Architecture', 'Next.js'],
  location: 'Mehmoodabad, Karachi, Pakistan',
  email: 'fahadalihyd2@gmail.com',
  phone: '+92-305-3041408',
  phoneHref: '+923053041408',
  photo: asset('/images/fahad.png'),
  avatar: asset('/images/avatar.png'),
  resume: asset('/Fahad_Ali_Resume.pdf'),
  github: 'https://github.com/fahadalihyd',
  linkedin: 'https://www.linkedin.com/in/fahad-ali-sheikh',
  summary:
    "I'm a Senior Software Engineer with 8+ years of experience building and deploying scalable web, SaaS, API-driven, and enterprise applications. My engineering background spans Laravel, PHP, Node.js, React, Vue.js, REST APIs, databases, AWS, Azure, CI/CD, and system architecture. Over the last few years, I've been increasingly focused on AI-powered software and agentic systems — integrating LLMs, AI agents, automation workflows, OCR, and AI APIs into real-world applications.",
  summary2:
    'My focus is evolving toward AI Solutions Engineering and Forward Deployed Engineering: taking ambiguous business problems, understanding the workflow and technical constraints, designing the right solution, rapidly prototyping it, integrating it with existing systems, and taking it into production. I work across the full lifecycle — discovery, architecture, AI and automation, integration, development, deployment, and optimization — including RAG and LLM applications, N8N and GrokBot automation, enterprise APIs, and cloud infrastructure. I also use Cursor, GitHub Copilot, Claude Code, and other AI-assisted tools to accelerate prototyping and delivery.',
}

export const stats = [
  { value: 8, suffix: '+', label: 'Years Experience' },
  { value: 19, suffix: '+', label: 'Projects Delivered' },
  { value: 3, suffix: '', label: 'Companies' },
  { value: 3, suffix: '', label: 'Awards Won' },
]

export const skillCategories = [
  {
    title: 'Backend',
    icon: 'server',
    items: ['Laravel', 'Node.js (Express)', 'CodeIgniter', 'PHP', 'HTML', 'CSS'],
  },
  {
    title: 'Frontend',
    icon: 'layout',
    items: [
      'JavaScript',
      'jQuery',
      'Vue.js',
      'React',
      'Next.js',
      'Ant Design',
      'Element Plus',
      'ShadCN',
      'Bootstrap',
      'Tailwind CSS',
    ],
  },
  { title: 'Databases', icon: 'database', items: ['MySQL', 'MongoDB'] },
  {
    title: 'Cloud & DevOps',
    icon: 'cloud',
    items: [
      'Software Architecture',
      'DevOps',
      'AWS',
      'Microsoft Azure',
      'CI/CD Pipelines',
      'GitHub Actions',
      'Server Setup & Deployment',
    ],
  },
  {
    title: 'AI & Automation',
    icon: 'brain',
    featured: true,
    items: [
      'LLMs',
      'RAG',
      'AI Agents',
      'OpenAI',
      'Google Gemini',
      'Anthropic Claude',
      'OCR',
      'N8N Automation',
      'GrokBot',
      'Agentic Development',
      'Prompt Engineering',
    ],
  },
  {
    title: 'AI-Assisted Dev Tools',
    icon: 'sparkles',
    items: ['GitHub Copilot', 'Cursor', 'Trae', 'Claude Code', 'Google Stitch'],
  },
  {
    title: 'Collaboration',
    icon: 'git',
    items: ['GitHub', 'Jira', 'Agile / Scrum'],
  },
]

export const sphereWords = [
  'Laravel',
  'PHP',
  'Node.js',
  'Vue.js',
  'React',
  'Next.js',
  'MySQL',
  'MongoDB',
  'AWS',
  'Azure',
  'OpenAI',
  'Claude',
  'Gemini',
  'N8N',
  'Tailwind',
  'JavaScript',
  'CI/CD',
  'REST API',
  'AI Agents',
  'RAG',
  'LLMs',
  'OCR',
  'GrokBot',
  'GitHub',
  'Jira',
  'Cursor',
  'Express',
  'ShadCN',
]

export const marqueeItems = [
  'Laravel',
  'Node.js',
  'Vue.js',
  'React',
  'Next.js',
  'PHP',
  'MySQL',
  'MongoDB',
  'AWS',
  'Azure',
  'OpenAI',
  'Claude',
  'N8N',
  'Tailwind CSS',
  'GitHub Actions',
  'AI Agents',
  'RAG',
  'LLMs',
  'GrokBot',
]

export const experience = [
  {
    role: 'Sr. Full Stack Developer',
    company: 'Arthur Lawrence',
    location: 'Karachi',
    period: 'September 2022 - Present',
    current: true,
    points: [
      'Design, develop, and maintain full stack applications using Laravel, Node.js, Vue.js, and React.',
      'Lead and mentor a team of developers, providing code reviews, suggestions, and technical guidance to improve code quality and maintainability.',
      'Architect and plan application structure, technical approach, and system design for new features and products.',
      'Support co-developers in troubleshooting and resolving technical issues across frontend, backend, and deployment environments.',
      'Build and consume RESTful APIs for web and mobile applications.',
      'Integrate third-party APIs, AI services (OpenAI), AI agents, and agentic automation workflows into production applications.',
      'Manage GitHub repositories, branching strategies, and CI/CD pipelines for staging and production environments.',
      'Set up, configure, and manage servers, and handle deployments on AWS and Azure with secure, scalable configurations.',
      'Optimize application performance, database queries, and backend services.',
      'Collaborate with product, frontend, and QA teams to deliver scalable features.',
    ],
    tech: ['Laravel', 'Vue.js', 'React', 'Node.js', 'OpenAI', 'AWS', 'Azure'],
  },
  {
    role: 'Sr. Backend / Full Stack Developer',
    company: 'Dot & Line',
    location: 'Karachi',
    period: 'April 2021 - September 2022',
    current: false,
    points: [
      'Developed and maintained enterprise web applications using Laravel, PHP, and MySQL.',
      'Designed and implemented REST APIs for frontend and mobile applications.',
      'Managed AWS infrastructure, including server setup, deployments, and monitoring.',
      'Implemented CI/CD pipelines using GitHub Actions.',
      'Improved application performance through query optimization and caching strategies.',
      'Generated complex reports and exports using advanced SQL queries.',
      'Collaborated with cross-functional teams following Agile methodologies.',
    ],
    tech: ['Laravel', 'PHP', 'MySQL', 'AWS', 'GitHub Actions'],
  },
  {
    role: 'PHP Developer',
    company: 'Gexton',
    location: 'Hyderabad',
    period: 'December 2018 - March 2021',
    current: false,
    points: [
      'Developed interactive web applications using PHP, JavaScript, and Vue.js on LAMP architecture.',
      'Interacted with clients to gather and analyze requirements, developing functionality accordingly.',
      'Collaborated with frontend and mobile developers on APIs using Laravel and Node.js.',
      'Performed project analysis and managed project features using GitHub branches.',
      'Handled database and schema design, bug fixes, and testing.',
      'Managed task tracking using Trello and Google Sheets.',
    ],
    tech: ['PHP', 'Vue.js', 'Laravel', 'Node.js', 'MySQL'],
  },
]

export type ProjectCategory = 'AI' | 'Laravel' | 'Vue' | 'MERN' | 'PHP'

export interface Project {
  name: string
  tech: string[]
  categories: ProjectCategory[]
  featured?: boolean
  description: string
  /** live site */
  url?: string
  /** above-the-fold screenshot */
  image?: string
  /** tall full-page screenshot used for the hover-scroll preview */
  imageFull?: string
  /** e.g. "Owner" */
  role?: string
  /** rendered as a large case-study card */
  showcase?: boolean
  aiPowered?: boolean
}

export const projects: Project[] = [
  {
    name: 'OrderSwift',
    tech: ['Laravel', 'Vue.js', 'OpenAI', 'WhatsApp'],
    categories: ['AI', 'Laravel', 'Vue'],
    showcase: true,
    aiPowered: true,
    role: 'Owner',
    url: 'https://ordersswift.com/',
    image: asset('/images/projects/orderswift.jpg'),
    imageFull: asset('/images/projects/orderswift-full.jpg'),
    description:
      'Multi-tenant e-commerce platform for Pakistani sellers: branded stores, cash-on-delivery checkout, one-tap WhatsApp updates, POS, and AI that turns chats into orders.',
  },
  {
    name: 'Monily',
    tech: ['Laravel', 'Vue.js', 'OpenAI', 'API'],
    categories: ['AI', 'Laravel', 'Vue'],
    showcase: true,
    aiPowered: true,
    url: 'https://monily-v2.vercel.app/',
    image: asset('/images/projects/monily.jpg'),
    imageFull: asset('/images/projects/monily-full.jpg'),
    description:
      'Outsourced finance platform with an AI-driven Growth Score dashboard, real-time financial intelligence and cash-flow forecasting for bookkeeping, tax and CFO advisory.',
  },
  {
    name: 'Beyond Limits Technologies',
    tech: ['Laravel', 'Vue.js', 'AI Solutions', 'E-commerce'],
    categories: ['AI', 'Laravel', 'Vue'],
    showcase: true,
    url: 'https://beyondlimitstechnologies.com/',
    image: asset('/images/projects/beyond-limits.jpg'),
    imageFull: asset('/images/projects/beyond-limits-full.jpg'),
    description:
      'Enterprise IT solutions partner and hardware storefront for new and certified refurbished servers, storage and networking, with quote requests and order tracking.',
  },
  {
    name: 'AI Task Management CRM',
    tech: ['Laravel', 'OpenAI', 'OCR', 'N8N'],
    categories: ['AI', 'Laravel'],
    featured: true,
    description:
      'An AI-driven CRM that turns documents and messages into structured tasks using OCR, OpenAI and N8N automation workflows.',
  },
  {
    name: 'Skill Inventory Matrix',
    tech: ['Laravel', 'OpenAI'],
    categories: ['AI', 'Laravel'],
    featured: true,
    description: 'AI-assisted skills inventory that maps team capabilities and surfaces gaps for smarter staffing.',
  },
  {
    name: 'UpBrainery - AI Content Generator',
    tech: ['Laravel', 'OpenAI'],
    categories: ['AI', 'Laravel'],
    featured: true,
    description: 'Generative AI platform that produces learning and marketing content powered by OpenAI.',
  },
  {
    name: 'HGA - Health Grades Analytics',
    tech: ['Laravel'],
    categories: ['Laravel'],
    description: 'Analytics platform for health grades with advanced reporting and data exports.',
  },
  {
    name: 'Dot & Line Learning',
    tech: ['Laravel', 'API'],
    categories: ['Laravel'],
    description: 'Learning platform with REST APIs serving web and mobile clients.',
  },
  {
    name: 'NxtGen',
    tech: ['Laravel', 'Vue.js'],
    categories: ['Laravel', 'Vue'],
    description: 'Modern Laravel and Vue.js application built for scale and performance.',
  },
  {
    name: 'GS-Films',
    tech: ['MongoDB', 'Express', 'React', 'Node.js'],
    categories: ['MERN'],
    description: 'Film platform built on the MERN stack with a dynamic React interface.',
  },
  {
    name: 'DST Inventory',
    tech: ['Laravel', 'Vue.js', 'API'],
    categories: ['Laravel', 'Vue'],
    description: 'Inventory management system with real-time stock tracking and API integrations.',
  },
  {
    name: 'United Builders',
    tech: ['Laravel'],
    categories: ['Laravel'],
    description: 'Business web application for a construction and builders company.',
  },
  {
    name: 'MeatApp',
    tech: ['Laravel', 'API'],
    categories: ['Laravel'],
    description: 'Ordering platform with a Laravel API powering the mobile app experience.',
  },
  {
    name: 'Argumentlist',
    tech: ['Laravel'],
    categories: ['Laravel'],
    description: 'Laravel web platform for structured arguments and discussion.',
  },
  {
    name: 'Zairyo',
    tech: ['CodeIgniter', 'Xero'],
    categories: ['PHP'],
    description: 'CodeIgniter application integrated with Xero for accounting workflows.',
  },
  {
    name: 'Tareeqna',
    tech: ['Core PHP'],
    categories: ['PHP'],
    description: 'Custom-built Core PHP web application.',
  },
  {
    name: 'Dulabi',
    tech: ['Laravel'],
    categories: ['Laravel'],
    description: 'Laravel-powered web application.',
  },
  {
    name: 'TRI Meditation',
    tech: ['Lumen'],
    categories: ['PHP'],
    description: 'Lightweight Lumen micro-service backend for a meditation experience.',
  },
  {
    name: 'IEC Courier',
    tech: ['Laravel'],
    categories: ['Laravel'],
    description: 'Courier and logistics management platform built with Laravel.',
  },
]

export const projectFilters: Array<'All' | ProjectCategory> = ['All', 'AI', 'Laravel', 'Vue', 'MERN', 'PHP']

export const awards = [
  { title: 'Positive Role Model', org: 'Arthur Lawrence', year: '2025', icon: 'star' },
  { title: 'Best Performer', org: 'Arthur Lawrence', year: '2023', icon: 'trophy' },
  { title: 'Employee of the Month', org: 'Dot & Line', year: 'Feb 2022', icon: 'medal' },
]

export const education = [
  {
    degree: 'Bachelor of Commerce (B.Com), Accounting and Computer Science',
    school: 'University of Sindh, Jamshoro',
    year: '2014–2016',
  },
  {
    degree: 'Web Development — HTML, CSS3, JavaScript, PHP, MySQL, CodeIgniter, Laravel, WordPress',
    school: 'Gexton Education',
    year: '2017–2018',
  },
  { degree: 'Pre-Engineering', school: 'Government Degree College, Hyderabad', year: '2012–2014' },
  { degree: 'Matriculation, Computer Science', school: 'New Banath High School, Hyderabad', year: '2011' },
]

export const languages = ['English', 'Urdu']

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Awards', href: '#awards' },
  { label: 'Contact', href: '#contact' },
]
