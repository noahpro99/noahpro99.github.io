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
    date: "Nov 2023",
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
    id: "graduate-researcher",
    title: "Graduate Student Researcher — Virginia Tech",
    subtitle: "Virginia Tech",
    description: "Researching advanced reasoning in large language models under Dr. Tu Vu (Google DeepMind, Faculty Researcher at Google), focusing on creative problem solving and parallel/multi-agent inference-time algorithms",
    startYear: 2025,
    startMonth: 1, // February
    type: "research",
    location: "Blacksburg, VA",
    current: true,
  },
  {
    id: "gta",
    title: "Graduate Teaching Assistant — Virginia Tech",
    subtitle: "Virginia Tech",
    description:
      "Instructed and assisted students in CS 2505 Computer Organization, CS 3214 Computer Systems, and CS 3114 Data Structures and Algorithms",
    startYear: 2024,
    startMonth: 7, // August
    type: "work",
    location: "Blacksburg, VA",
    current: true,
  },
  {
    id: "ms-cs",
    title: "MS in Computer Science — Virginia Tech",
    subtitle: "Virginia Tech",
    description: "Conducting research under Dr. Tu Vu on advanced LLM reasoning training techniques. Graduate level classes include Machine Learning, Artificial Intelligence, and Advanced Algorithms",
    startYear: 2024,
    startMonth: 7, // August
    endYear: 2026,
    endMonth: 4, // May
    type: "education",
    location: "Falls Church, VA",
    current: true,
  },
  {
    id: "research-assistant",
    title: "Research Assistant — Hume Center VT",
    subtitle: "Hume Center VT",
    description: "Developed a multi-agent reinforcement learning environment analyzing how reward structure, observation noise, and update frequency influenced emergent swarm behavior. Implemented a covert encoding/decoding pipeline for LLMs in PyTorch, showing that higher bits-per-token negatively impacted textual similarity while preserving reliable message recovery",
    startYear: 2023,
    startMonth: 8, // September
    endYear: 2024,
    endMonth: 7, // August
    type: "research",
    location: "Blacksburg, VA",
  },
  {
    id: "bs-cs-physics",
    title: "BS in CS & Physics — Virginia Tech",
    subtitle: "Virginia Tech",
    description: "Recognized on the Dean's List with Distinction. Member of Sigma Pi Sigma National Physics Honor Society and Tau Sigma National Honor Society. Awarded the Robert C. Richardson Physics Scholarship",
    startYear: 2021,
    startMonth: 7, // August
    endYear: 2024,
    endMonth: 4, // May
    type: "education",
    location: "Blacksburg, VA",
  },
  {
    id: "swe-intern",
    title: "Internship — Fischer Jordan",
    subtitle: "Fischer Jordan",
    description: "Built predictive models achieving 75% accuracy. Spearheaded development of website monitoring service used by 3 client companies. Automated data collection and analysis for LinkedIn research project with 800 applicants. Managed dev-ops for 24-hour services running on EC2, internal servers, and crypto mine. Built full stack automated review system used by ~40-member firm",
    startYear: 2021,
    startMonth: 0, // January
    endYear: 2023,
    endMonth: 11, // December
    type: "work",
    location: "New York, NY",
  },
  {
    id: "nrcc",
    title: "Associate's Degree — NRVCC",
    subtitle: "New River Valley Community College",
    description:
      "Completed A.S. with specialization in Computer Science. Received Outstanding Student Award in Computer Science. Honored as member of Phi Theta Kappa Honor Society with placement on President's and Dean's Lists",
    startYear: 2019,
    startMonth: 7, // August
    endYear: 2021,
    endMonth: 4, // May
    type: "education",
    location: "Christiansburg, VA",
  },
];
