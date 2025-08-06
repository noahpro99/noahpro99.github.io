import type { ContentItem } from "../components/ContentCard";

export const allContent: ContentItem[] = [
  {
    id: "how-i-ended-up-sending-in-my-first-linux-kernel-patch",
    type: "blog",
    title: "How I Ended Up Sending In My First Linux Kernel Patch",
    description:
      "A deep dive into reverse engineering HP's OMEN Gaming Hub to understand fan control and creating a Linux kernel patch for proper hardware support.",
    date: "Jul 2025",
    category: "Systems Programming",
    blogPath:
      "/blog/how-i-ended-up-sending-in-my-first-linux-kernel-patch/blog.md",
    showOnFrontPage: true,
  },
  {
    id: "intuition-for-the-transformer-model",
    type: "blog",
    title: "Intuition for the Transformer Model",
    description:
      "A visual and intuitive explanation of the transformer model architecture and its components.",
    date: "Dec 2024",
    category: "Research",
    image:
      "/blog/intuition-for-the-transformer-model/transformer-encoder-decoder-example-with-attention.png",
    blogPath: "/blog/intuition-for-the-transformer-model/blog.md",
    showOnFrontPage: true,
  },
  {
    id: "uncover-card-game",
    type: "project",
    title: "Uncover Card Game",
    description:
      "Online clue-based card game with 1350+ matches played and 200+ registered users",
    date: "2024",
    category: "Web Development",
    link: "https://uncovercardgame.com",
    showOnFrontPage: true,
    githubRepo: "Rituraj003/Uncover-card-game",
  },
];

// Enhanced skills configuration with descriptions and project links
export interface Skill {
  name: string;
  description: string;
  projectLink?: string;
  projectId?: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export const technicalSkills: SkillCategory[] = [
  {
    title: "AI & Machine Learning",
    skills: [
      {
        name: "Python",
        description:
          "5+ years building ML models, research automation, and data analysis pipelines",
        projectId: "multi-agent-reinforcement-learning",
      },
      {
        name: "PyTorch",
        description:
          "Deep learning research including multi-agent RL and computer vision models",
        projectId: "multi-agent-reinforcement-learning",
      },
      {
        name: "Reinforcement Learning",
        description:
          "Research in multi-agent systems and swarm behavior modeling",
        projectId: "multi-agent-reinforcement-learning",
      },
    ],
  },
  {
    title: "Full-Stack Development",
    skills: [
      {
        name: "React & TypeScript",
        description:
          "Modern web applications with type safety and responsive design",
        projectId: "mind-app",
      },
      {
        name: "Node.js",
        description:
          "Backend APIs, real-time systems, and microservices architecture",
        projectId: "uncover-card-game",
      },
      {
        name: "Database Design",
        description:
          "PostgreSQL, MongoDB, and Redis for scalable data solutions",
      },
    ],
  },
  {
    title: "Research & Analytics",
    skills: [
      {
        name: "Statistical Analysis",
        description:
          "R and Python for experimental design and data interpretation",
        projectId: "machine-learning-physics",
      },
      {
        name: "Scientific Computing",
        description: "Computational physics simulations and numerical methods",
        projectId: "machine-learning-physics",
      },
    ],
  },
];

// Helper functions
export function getFrontPageContent(): ContentItem[] {
  return allContent.filter((item) => item.showOnFrontPage).slice(0, 3);
}

export function getAllProjects(): ContentItem[] {
  return allContent.filter((item) => item.type === "project");
}

export function getAllBlogs(): ContentItem[] {
  return allContent.filter((item) => item.type === "blog");
}

export function getContentById(id: string): ContentItem | undefined {
  return allContent.find((item) => item.id === id);
}

// Timeline configuration
export interface TimelineEvent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  startYear: number;
  endYear?: number;
  type: "education" | "work" | "research";
  location: string;
  current?: boolean;
  contentIds?: string[];
}

export interface TimelineItem {
  id: string;
  title: string;
  year: number;
  type: "project" | "blog" | "achievement";
  description: string;
  link?: string;
  contentId?: string;
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: "ms-cs",
    title: "MS Computer Science",
    subtitle: "Virginia Tech",
    description: "Research in LLM reasoning under Dr. Tu Vu",
    startYear: 2024,
    type: "education",
    location: "Blacksburg, VA",
    current: true,
    contentIds: ["multi-agent-reinforcement-learning"],
  },
  {
    id: "bs-cs-physics",
    title: "BS Computer Science & Physics",
    subtitle: "Virginia Tech",
    description: "Dean's List with Distinction",
    startYear: 2021,
    endYear: 2024,
    type: "education",
    location: "Blacksburg, VA",
  },
  {
    id: "research-assistant",
    title: "Research Assistant",
    subtitle: "Hume Center VT",
    description: "Multi-agent RL & LLM covert encoding",
    startYear: 2023,
    endYear: 2024,
    type: "research",
    location: "Virginia Tech",
    contentIds: ["multi-agent-reinforcement-learning"],
  },
  {
    id: "swe-intern",
    title: "Software Engineering Intern",
    subtitle: "Fischer Jordan",
    description: "Predictive modeling & full-stack development",
    startYear: 2021,
    endYear: 2023,
    type: "work",
    location: "Richmond, VA",
    contentIds: ["omenix", "uncover-card-game"],
  },
];

export const timelineItems: TimelineItem[] = [
  {
    id: "multi-agent-rl",
    title: "Multi-Agent RL Research",
    year: 2023,
    type: "blog",
    description: "Research project on multi-agent reinforcement learning",
    contentId: "multi-agent-reinforcement-learning",
  },
  {
    id: "omenix-project",
    title: "Omenix Platform",
    year: 2024,
    type: "project",
    description: "Advanced project management and collaboration platform",
    contentId: "omenix",
  },
  {
    id: "uncover-game",
    title: "Uncover Card Game",
    year: 2024,
    type: "project",
    description: "Online clue-based card game with 1350+ matches played",
    contentId: "uncover-card-game",
  },
];
