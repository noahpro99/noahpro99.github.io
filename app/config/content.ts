import type { ContentItem } from "../components/ContentCard";

// Re-export ContentItem for other components
export type { ContentItem };

export const allContent: ContentItem[] = [
  {
    id: "how-i-ended-up-sending-in-my-first-linux-kernel-patch",
    type: "blog",
    title: "How I Ended Up Sending In My First Linux Kernel Patch",
    description:
      "A deep dive into reverse engineering HP's OMEN Gaming Hub to understand fan control and creating a Linux kernel patch for proper hardware support.",
    date: "Jul 2025",
    category: "Systems Programming",
    image:
      "/blog/how-i-ended-up-sending-in-my-first-linux-kernel-patch/EC-highlighted.png",
    blogPath:
      "/blog/how-i-ended-up-sending-in-my-first-linux-kernel-patch/blog.md",
    showOnFrontPage: true,
    showOnTimeline: true,
  },
  {
    id: "intuition-for-the-transformer-model",
    type: "blog",
    title: "Intuition for the Transformer Model",
    description:
      "A visual and intuitive explanation of the transformer model architecture and its components.",
    date: "Sep 2023",
    category: "Research",
    image:
      "/blog/intuition-for-the-transformer-model/transformer-encoder-decoder-example-with-attention.png",
    blogPath: "/blog/intuition-for-the-transformer-model/blog.md",
    showOnFrontPage: true,
    showOnTimeline: true,
  },
  {
    id: "uncover-card-game",
    type: "blog",
    title: "Uncover",
    description:
      "Online clue-based card game with 1350+ matches played and 200+ registered users",
    date: "Sep 2024",
    category: "Web Development",
    image: "/blog/uncover-card-game/gameplay.png",
    blogPath: "/blog/uncover-card-game/blog.md",
    showOnTimeline: true,
  },
  {
    id: "3Dera",
    type: "project",
    title: "3D Era",
    description:
      "A web-based platform for creating and sharing 3D models and environments.",
    date: "Mar 2024",
    category: "Hackathon Project",
    link: "https://github.com/noahpro99/3Dera",
    showOnFrontPage: true,
    image: "http://img.youtube.com/vi/L3gGZ3T9t98/0.jpg",
    githubRepo: "noahpro99/3Dera",
    showOnTimeline: true,
  },
  {
    id: "Forge",
    type: "project",
    title: "Forge",
    description:
      "A web-based platform for creating and sharing 3D models and environments.",
    date: "Sep 2024",
    category: "Hackathon Project",
    link: "https://github.com/noahpro99/Forge",
    image: "https://github.com/noahpro99/Forge/blob/main/img/demo.png?raw=true",
    githubRepo: "noahpro99/Forge",
    showOnTimeline: true,
  },
  {
    id: "micrograd-rs",
    type: "project",
    title: "micrograd-rs",
    description:
      "A tiny autograd engine for learning purposes in Rust. Based on the Python version by Andrej Karpathy.",
    date: "Apr 2024",
    category: "AI & Machine Learning",
    link: "https://github.com/noahpro99/micrograd-rs",
    image:
      "https://github.com/noahpro99/micrograd-rs/blob/main/images/image.png?raw=true",
    githubRepo: "noahpro99/micrograd-rs",
    showOnTimeline: true,
  },
  {
    id: "robust-swarm",
    type: "project",
    title: "Robust Swarm",
    description:
      "A reinforcement learning-based agent that dynamically optimizes paths to keep drone swarms mission-cohesive, even amid interference.",
    date: "Mar 2025",
    category: "AI & Machine Learning",
    link: "https://github.com/noahpro99/robust-swarm",
    image:
      "https://github.com/noahpro99/robust-swarm/blob/main/images/diagram.png?raw=true",
    githubRepo: "noahpro99/robust-swarm",
    showOnTimeline: true,
  },
  {
    id: "codekids",
    type: "project",
    title: "CodeKids",
    description:
      "An educational platform with interactive books to teach programming concepts to children.",
    date: "Jan 2025",
    category: "Web Development",
    link: "https://codekids.cs.vt.edu/",
    image: "/images/codekids-ss.png",
    githubRepo: "codekids-vt/codekids",
    showOnTimeline: true,
  },
];

// Skills configuration with simple lists
export interface SkillCategory {
  title: string;
  skills: SkillItem[];
}

interface SkillItem {
  name: string;
  icon: string;
}

export const technicalSkills: SkillCategory[] = [
  {
    title: "Programming & Tools",
    skills: [
      { name: "TypeScript", icon: "typescript" },
      { name: "C", icon: "c" },
      { name: "React", icon: "react" },
      { name: "SQL", icon: "database" },
      { name: "Rust", icon: "rust" },
      { name: "Linux", icon: "linux" },
      { name: "Docker", icon: "docker" },
      { name: "Git", icon: "git" },
      { name: "Apps Script", icon: "googleappsscript" },
    ],
  },
  {
    title: "AI & Machine Learning",
    skills: [
      { name: "Python", icon: "python" },
      { name: "TensorFlow", icon: "tensorflow" },
      { name: "PyTorch", icon: "pytorch" },
      { name: "Pandas", icon: "pandas" },
      { name: "RLLib", icon: "rllib" },
      { name: "Hugging Face", icon: "huggingface" },
      { name: "Excel/Sheets Models", icon: "spreadsheet" },
    ],
  },
  {
    title: "3D Design & Simulation",
    skills: [
      { name: "3D CAD and printing (Onshape)", icon: "cube" },
      { name: "3D simulation/rendering (Blender)", icon: "blender" },
      { name: "Godot Game Engine", icon: "godotengine" },
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

export function getTimelineContent(): ContentItem[] {
  return allContent
    .filter((item) => item.showOnTimeline)
    .sort((a, b) => {
      // Parse years and months for sorting
      const parseDate = (dateStr: string) => {
        const dateParts = dateStr.split(" ");
        const year = parseInt(dateParts.pop() || "2024");
        const monthStr = dateParts[0];

        const monthMap: { [key: string]: number } = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11,
        };

        const month = monthMap[monthStr] || 0;
        return year * 12 + month; // Convert to months for easy comparison
      };

      return parseDate(a.date) - parseDate(b.date); // Sort by date ascending
    });
}

// Timeline configuration
export interface TimelineEvent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  startYear: number;
  startMonth: number; // 0-11 (Jan=0, Dec=11)
  endYear?: number;
  endMonth?: number; // 0-11 (Jan=0, Dec=11)
  type: "education" | "work" | "research";
  location: string;
  current?: boolean;
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: "ms-cs",
    title: "MS Computer Science",
    subtitle: "Virginia Tech",
    description: "Research in LLM reasoning under Dr. Tu Vu",
    startYear: 2024,
    startMonth: 7, // August
    endYear: 2026,
    endMonth: 4, // May
    type: "education",
    location: "Falls Church, VA",
    current: true,
  },
  {
    id: "gta",
    title: "Graduate Teaching Assistant",
    subtitle: "Virginia Tech",
    description:
      "Instructed CS 2505 Computer Organization and CS 3214 Computer Systems",
    startYear: 2024,
    startMonth: 7, // August
    endYear: 2026,
    endMonth: 4, // May
    type: "work",
    location: "Blacksburg, VA",
    current: true,
  },
  {
    id: "bs-cs-physics",
    title: "BS Computer Science & Physics",
    subtitle: "Virginia Tech",
    description: "Dean's List with Distinction, Sigma Pi Sigma, Tau Sigma",
    startYear: 2020,
    startMonth: 7, // August
    endYear: 2024,
    endMonth: 4, // May
    type: "education",
    location: "Blacksburg, VA",
  },
  {
    id: "research-assistant",
    title: "Research Assistant",
    subtitle: "Hume Center VT",
    description: "Multi-agent RL & LLM covert encoding under Dr. Maice Costa",
    startYear: 2023,
    startMonth: 8, // September
    endYear: 2024,
    endMonth: 7, // August
    type: "research",
    location: "Blacksburg, VA",
  },
  {
    id: "swe-intern",
    title: "Data and Software Engineer",
    subtitle: "FischerJordan",
    description: "Predictive modeling, website monitoring, dev-ops management",
    startYear: 2021,
    startMonth: 6, // July
    endYear: 2022,
    endMonth: 7, // August (continuing into next semester)
    type: "work",
    location: "New York, NY (Remote)",
  },
  {
    id: "nrcc",
    title: "Associate's Degree",
    subtitle: "New River Valley Community College",
    description:
      "A.S. Computer Science, Outstanding Student Award, Phi Theta Kappa",
    startYear: 2019,
    startMonth: 7, // August
    endYear: 2020,
    endMonth: 4, // May
    type: "education",
    location: "Christiansburg, VA",
  },
];
