import type { Route } from "./+types/home";
import { useState, useEffect } from "react";
import {
  Lightbulb,
  CreditCard,
  Globe,
  BookOpen,
  CheckCircle,
  Zap,
  Code,
  Mail,
  ArrowRight,
  ExternalLink,
  Phone,
  Calendar,
  MapPin,
} from "lucide-react";
import { ContentCard } from "../components/ContentCard";
import { HorizontalTimeline } from "../components/Timeline";
import { Navigation, Footer, CTAButton } from "../components/shared";
import { SkillIcon } from "../components/SkillIcon";
import {
  getFrontPageContent,
  technicalSkills,
  getContentById,
} from "../config/content";

// Custom brand icon components to replace deprecated Lucide brand icons
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

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
      {
        threshold: 0.05, // Reduced threshold for faster triggering
        rootMargin: "100px", // Increased root margin for earlier triggering
      }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return visibleElements;
}

// Components

function HeroSection() {
  const visibleElements = useScrollAnimation();

  const handleContactClick = () => {
    const footerElement = document.getElementById("footer");
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-3 sm:px-4 md:px-8 py-8 sm:py-12 md:py-20">
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-bold leading-tight mb-4 sm:mb-6 md:mb-8">
            Noah Provenzano
            <br />
            <span className="text-dim-gray text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-normal">
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
          <p className="text-dim-gray text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12 leading-relaxed px-2 sm:px-4">
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
          <div className="flex flex-col gap-4 justify-center items-center">
            <CTAButton
              onClick={handleContactClick}
              variant="primary"
              animated={true}
            >
              Contact Me
            </CTAButton>
            <div className="flex gap-4 sm:gap-6">
              <a
                href="https://github.com/noahpro99"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dim-gray hover:text-coral transition-colors flex items-center gap-2 text-xs sm:text-sm md:text-base"
              >
                <GithubIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/noah-provenzano-90"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dim-gray hover:text-coral transition-colors flex items-center gap-2 text-xs sm:text-sm md:text-base"
              >
                <LinkedinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const visibleElements = useScrollAnimation();

  // Handle hash navigation (like /#footer)
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          // Small delay to ensure page is fully loaded
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    };

    // Handle hash on initial load
    handleHashNavigation();

    // Handle hash changes
    window.addEventListener("hashchange", handleHashNavigation);

    return () => {
      window.removeEventListener("hashchange", handleHashNavigation);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-night">
      {/* Navigation in white area */}
      <div className="bg-white">
        <Navigation />
      </div>

      {/* Hero Section - Dark rounded container - Mobile optimized */}
      <div className="relative px-1 sm:px-2 md:px-4 lg:px-8 pb-1 sm:pb-2 md:pb-4 lg:pb-8">
        <div className="bg-night rounded-2xl sm:rounded-2xl md:rounded-2xl lg:rounded-[2rem] xl:rounded-[3rem] text-white overflow-hidden">
          <HeroSection />
        </div>
      </div>

      {/* Content Feed - White background section */}
      <div className="bg-white py-8 sm:py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8">
          <div
            id="content-title"
            data-animate
            className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-1000 ${
              visibleElements.has("content-title")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-night mb-2 sm:mb-3 md:mb-4">
              Projects & Insights
            </h2>
            <p className="text-dim-gray text-sm sm:text-base md:text-lg px-2 sm:px-4">
              A collection of my work, research, and thoughts on technology
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
            {getFrontPageContent().map((item, index) => (
              <ContentCard
                key={item.id}
                item={item}
                index={index}
                visibleElements={visibleElements}
              />
            ))}
          </div>

          {/* See All Button */}
          <div className="text-center">
            <CTAButton href="/blog-projects" variant="primary" animated={true}>
              See All Projects & Blog Posts
            </CTAButton>
          </div>
        </div>
      </div>

      {/* Skills & Timeline Section - Dark rounded container - Mobile optimized */}
      <div className="relative p-1 sm:p-2 md:p-4 lg:p-8">
        <div className="bg-night rounded-2xl sm:rounded-2xl md:rounded-2xl lg:rounded-[2rem] xl:rounded-[3rem] text-white overflow-hidden">
          <div className="px-3 sm:px-4 md:px-8 py-8 sm:py-12 md:py-20">
            <div className="max-w-6xl mx-auto">
              {/* Photo and Skills Section */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-20">
                {/* Photo Section */}
                <div className="lg:col-span-1 order-2 lg:order-1">
                  <div
                    id="timeline-photo"
                    data-animate
                    className={`lg:sticky lg:top-8 transition-all duration-1000 ${
                      visibleElements.has("timeline-photo")
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                  >
                    <img
                      src="/images/suit-smile.jpg"
                      alt="Noah Provenzano"
                      className="w-full h-48 sm:h-64 md:h-80 lg:h-full object-cover object-top rounded-lg sm:rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Skills Section */}
                <div className="lg:col-span-3 order-1 lg:order-2">
                  <div
                    id="skills-title"
                    data-animate
                    className={`mb-4 sm:mb-6 md:mb-8 transition-all duration-1000 ${
                      visibleElements.has("skills-title")
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                  >
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
                      Technical Skills
                    </h2>
                    <p className="text-dim-gray text-sm sm:text-base md:text-lg">
                      Technologies and tools I work with
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    {technicalSkills.map((category, categoryIndex) => (
                      <div
                        key={category.title}
                        id={`skill-${category.title.replace(/\s+/g, "-").toLowerCase()}`}
                        data-animate
                        className={`transition-all duration-1000 ${
                          visibleElements.has(
                            `skill-${category.title.replace(/\s+/g, "-").toLowerCase()}`
                          )
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-8"
                        }`}
                        style={{ transitionDelay: `${categoryIndex * 150}ms` }}
                      >
                        <div className="bg-jet rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 h-full border border-dim-gray/20">
                          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 sm:mb-3 md:mb-4">
                            {category.title}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {category.skills.map((skill, skillIndex) => (
                              <span
                                key={skill.name}
                                className="bg-coral text-jet px-2 sm:px-2 md:px-3 py-1 rounded-md sm:rounded-lg md:rounded-xl text-xs sm:text-xs md:text-sm font-medium flex items-center gap-1 sm:gap-1 md:gap-2"
                              >
                                <SkillIcon
                                  type={skill.icon}
                                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4"
                                />
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Horizontal Timeline */}
              <HorizontalTimeline visibleElements={visibleElements} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
