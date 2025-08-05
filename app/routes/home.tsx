import type { Route } from "./+types/home";
import { useState, useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Noah Provenzano - Computer Science Graduate" },
    {
      name: "description",
      content:
        "Master's student at Virginia Tech passionate about software engineering and research",
    },
  ];
}

// Types
interface ContentItem {
  id: string;
  type: "project" | "blog";
  title: string;
  description: string;
  date: string;
  category: string;
  badge?: string;
  link?: string;
  icon: "lightbulb" | "card" | "globe" | "book" | "research" | "ai" | "code";
}

// Data
const contentItems: ContentItem[] = [
  {
    id: "1",
    type: "project",
    title: "Mind",
    description:
      "AI-powered micro learning app selected for 2025 ACC InVenture Competition",
    date: "2025",
    category: "AI/Education",
    badge: "2025",
    icon: "lightbulb",
  },
  {
    id: "2",
    type: "blog",
    title: "Multi-Agent Reinforcement Learning in Swarm Behavior",
    description:
      "Exploring how reward structures influence emergent behaviors in predator-prey scenarios and quantifying effects on time-to-prey-capture.",
    date: "Dec 2024",
    category: "Research",
    icon: "research",
  },
  {
    id: "3",
    type: "project",
    title: "Uncover Card Game",
    description:
      "Online clue-based card game with 1350+ matches played and 200+ registered users",
    date: "2024",
    category: "Web Development",
    link: "https://uncovercardgame.com",
    icon: "card",
  },
  {
    id: "4",
    type: "blog",
    title: "Covert Encoding in Large Language Models",
    description:
      "Investigating the trade-offs between encoding capacity and text quality in LLM steganography techniques.",
    date: "Nov 2024",
    category: "AI/ML",
    icon: "ai",
  },
  {
    id: "5",
    type: "project",
    title: "3Dera",
    description:
      "1st place at HooHacks UVA - 3D VR historical scenes with AI-powered narration",
    date: "2024",
    category: "VR/AI",
    badge: "🏆 Winner",
    icon: "globe",
  },
  {
    id: "6",
    type: "blog",
    title: "Building Scalable Educational Platforms",
    description:
      "Lessons learned from leading a team of nine students on CodeKids educational resources platform.",
    date: "Oct 2024",
    category: "Development",
    icon: "code",
  },
  {
    id: "7",
    type: "project",
    title: "CodeKids",
    description:
      "Team lead for CS educational resources platform serving K-12 students",
    date: "2024",
    category: "Education",
    badge: "VT Research",
    link: "https://codekids.cs.vt.edu/",
    icon: "book",
  },
];

// Animation hook for scroll-triggered animations
function useScrollAnimation() {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return visibleElements;
}

// Components
function IconComponent({
  icon,
  className,
}: {
  icon: ContentItem["icon"];
  className?: string;
}) {
  const iconMap = {
    lightbulb: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    ),
    card: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    ),
    globe: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
      />
    ),
    book: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    ),
    research: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    ai: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
    code: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    ),
  };

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {iconMap[icon]}
    </svg>
  );
}

function Navigation() {
  return (
    <nav className="flex items-center justify-between px-8 py-6">
      <div className="flex items-center space-x-8">
        <a href="#" className="text-white hover:text-coral transition-colors">
          HOME
        </a>
        <a
          href="#"
          className="text-dim-gray hover:text-coral transition-colors"
        >
          ABOUT
        </a>
      </div>
      <div className="flex items-center">
        <div className="w-8 h-8 bg-coral transform rotate-45"></div>
      </div>
      <div className="flex items-center space-x-8">
        <a
          href="#"
          className="text-dim-gray hover:text-coral transition-colors"
        >
          WORK
        </a>
        <a
          href="#"
          className="text-dim-gray hover:text-coral transition-colors"
        >
          CONTACT
        </a>
      </div>
    </nav>
  );
}

function HeroSection() {
  const visibleElements = useScrollAnimation();

  return (
    <div className="flex flex-col items-center justify-center px-8 py-20">
      <div className="text-center max-w-4xl">
        <div
          id="hero-title"
          data-animate
          className={`transition-all duration-1000 ${
            visibleElements.has("hero-title")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8">
            Noah Provenzano
            <br />
            <span className="text-dim-gray text-4xl md:text-5xl lg:text-6xl font-normal">
              Computer Science Graduate Student
            </span>
          </h1>
        </div>

        <div
          id="hero-description"
          data-animate
          className={`transition-all duration-1000 delay-300 ${
            visibleElements.has("hero-description")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-dim-gray text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Master's student at Virginia Tech passionate about leveraging
            technology to develop innovative solutions. Seeking opportunities in
            software engineering and research roles.
          </p>
        </div>

        <div
          id="hero-cta"
          data-animate
          className={`transition-all duration-1000 delay-500 ${
            visibleElements.has("hero-cta")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-coral hover:bg-coral/90 text-white px-8 py-4 rounded-full font-medium transition-colors flex items-center gap-2">
              Contact Me
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
            <div className="flex gap-4">
              <a
                href="https://github.com/noahpro99"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dim-gray hover:text-coral transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/noah-provenzano-90"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dim-gray hover:text-coral transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentCard({ item, index }: { item: ContentItem; index: number }) {
  const visibleElements = useScrollAnimation();
  const isVisible = visibleElements.has(`content-${item.id}`);

  const iconBg = item.type === "project" ? "bg-coral" : "bg-white";
  const iconColor = item.type === "project" ? "text-white" : "text-night";

  return (
    <div
      id={`content-${item.id}`}
      data-animate
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="bg-jet rounded-2xl p-6 hover:bg-jet/80 transition-all cursor-pointer group">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
          >
            <IconComponent
              icon={item.icon}
              className={`w-6 h-6 ${iconColor}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-coral text-sm font-medium">
                {item.category}
              </span>
              {item.badge && (
                <span className="bg-coral/20 text-coral text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-coral transition-colors">
              {item.title}
            </h3>

            <p className="text-dim-gray text-sm mb-3 line-clamp-2">
              {item.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-dim-gray">{item.date}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-dim-gray capitalize">
                  {item.type}
                </span>
                {item.link && (
                  <svg
                    className="w-3 h-3 text-dim-gray group-hover:text-coral transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  title,
  subtitle,
  description,
  date,
  isActive,
  side,
}: {
  title: string;
  subtitle: string;
  description: string;
  date: string;
  isActive: boolean;
  side: "left" | "right";
}) {
  const visibleElements = useScrollAnimation();
  const isVisible = visibleElements.has(
    `timeline-${title.replace(/\s+/g, "-").toLowerCase()}`
  );

  return (
    <div
      className={`relative flex items-center ${side === "right" ? "md:justify-end" : ""}`}
    >
      <div
        className={`absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 ${isActive ? "bg-coral" : "bg-white"} rounded-full border-4 border-night`}
      ></div>
      <div
        id={`timeline-${title.replace(/\s+/g, "-").toLowerCase()}`}
        data-animate
        className={`ml-16 md:ml-0 md:w-1/2 ${side === "right" ? "md:pl-8" : "md:pr-8"} transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="bg-jet rounded-xl p-6">
          <span
            className={`${isActive ? "text-coral" : "text-white"} text-sm font-medium`}
          >
            {date}
          </span>
          <h3 className="text-lg font-semibold mt-1">{title}</h3>
          <p className="text-dim-gray text-sm mt-2">
            {subtitle} • {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const visibleElements = useScrollAnimation();

  return (
    <div className="min-h-screen bg-white text-night">
      {/* Hero Section - Dark rounded container */}
      <div className="relative p-4 md:p-8">
        <div className="bg-night rounded-[2rem] md:rounded-[3rem] text-white overflow-hidden">
          <Navigation />
          <HeroSection />
        </div>
      </div>

      {/* Content Feed - White background section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div
            id="content-title"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleElements.has("content-title")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-night mb-4">
              Projects & Insights
            </h2>
            <p className="text-dim-gray text-lg">
              A collection of my work, research, and thoughts on technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentItems.map((item, index) => (
              <ContentCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section - Dark rounded container */}
      <div className="relative p-4 md:p-8">
        <div className="bg-night rounded-[2rem] md:rounded-[3rem] text-white overflow-hidden">
          <div className="px-8 py-20">
            <div className="max-w-4xl mx-auto">
              <div
                id="timeline-title"
                data-animate
                className={`text-center mb-16 transition-all duration-1000 ${
                  visibleElements.has("timeline-title")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <h2 className="text-3xl md:text-4xl font-bold">
                  Journey Timeline
                </h2>
              </div>

              <div className="relative">
                <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-0.5 h-full bg-dim-gray"></div>

                <div className="space-y-12">
                  <TimelineItem
                    title="MS Computer Science"
                    subtitle="Virginia Tech"
                    description="Research in LLM reasoning under Dr. Tu Vu"
                    date="2024 - Present"
                    isActive={true}
                    side="left"
                  />

                  <TimelineItem
                    title="BS Computer Science & Physics"
                    subtitle="Virginia Tech"
                    description="Dean's List with Distinction"
                    date="2021 - 2024"
                    isActive={false}
                    side="right"
                  />

                  <TimelineItem
                    title="Research Assistant"
                    subtitle="Hume Center VT"
                    description="Multi-agent RL & LLM covert encoding"
                    date="2023 - 2024"
                    isActive={true}
                    side="left"
                  />

                  <TimelineItem
                    title="Software Engineering Intern"
                    subtitle="Fischer Jordan"
                    description="Predictive modeling & full-stack development"
                    date="2021 - 2023"
                    isActive={false}
                    side="right"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - White background */}
      <div className="bg-white py-16">
        <div
          id="footer"
          data-animate
          className={`text-center max-w-4xl mx-auto px-8 transition-all duration-1000 ${
            visibleElements.has("footer")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-night mb-4">
              Let's Connect
            </h3>
            <p className="text-dim-gray mb-6">
              Always interested in new opportunities and collaborations
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8">
            <a
              href="mailto:noahpro@gmail.com"
              className="text-night hover:text-coral transition-colors font-medium"
            >
              noahpro@gmail.com
            </a>
            <a
              href="tel:540-315-6063"
              className="text-night hover:text-coral transition-colors font-medium"
            >
              (540) 315-6063
            </a>
          </div>

          <div className="flex justify-center space-x-6 mb-8">
            <a
              href="https://github.com/noahpro99"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dim-gray hover:text-coral transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/noah-provenzano-90"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dim-gray hover:text-coral transition-colors"
            >
              LinkedIn
            </a>
          </div>

          <p className="text-xs text-dim-gray">© 2025 Noah Provenzano</p>
        </div>
      </div>
    </div>
  );
}
