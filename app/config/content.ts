import type { ContentItem } from "../components/ContentCard";

// Content configuration - centralized place for all projects and blog posts
export const allContent: ContentItem[] = [
  {
    id: "omenix",
    type: "project",
    title: "Omenix",
    description: "Advanced project management and collaboration platform",
    date: "2024",
    category: "Web Development",
    showOnFrontPage: true,
    githubRepo: "noahpro99/omenix",
  },
  {
    id: "multi-agent-reinforcement-learning",
    type: "blog",
    title: "Multi-Agent Reinforcement Learning in Swarm Behavior",
    description:
      "Exploring how reward structures influence emergent behaviors in predator-prey scenarios and quantifying effects on time-to-prey-capture.",
    date: "Dec 2024",
    category: "Research",
    image: "/logo.jpg",
    blogPath: "/blog/multi-agent-reinforcement-learning.md",
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
