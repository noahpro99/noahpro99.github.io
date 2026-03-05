import type { Route } from "./+types/home";
import { useState, useEffect } from "react";
import { BookOpen, Mail, ArrowRight, Phone } from "lucide-react";
import { VerticalTimeline } from "../components/Timeline";
import { getFrontPageContent } from "../config/content";

// Social media icons
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

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

function MatrixIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.632.55v22.9H2.28V24H0V0h2.28v.55zm7.043 7.26v1.157h.033c.309-.443.683-.784 1.117-1.024.433-.245.936-.365 1.5-.365.54 0 1.033.107 1.481.314.448.208.785.582 1.02 1.108.254-.374.6-.706 1.034-.992.434-.287.95-.43 1.546-.43.453 0 .872.056 1.26.167.388.11.716.286.993.53.276.245.489.559.646.951.152.392.23.863.23 1.417v5.728h-2.349V11.52c0-.286-.01-.559-.032-.812a1.755 1.755 0 0 0-.18-.66 1.106 1.106 0 0 0-.438-.448c-.194-.11-.457-.166-.785-.166-.332 0-.6.064-.803.189a1.38 1.38 0 0 0-.48.499 1.946 1.946 0 0 0-.231.696 5.56 5.56 0 0 0-.06.817v4.957h-2.35v-4.93c0-.265-.004-.503-.019-.712a1.829 1.829 0 0 0-.155-.66 1.091 1.091 0 0 0-.424-.457c-.181-.112-.438-.166-.763-.166-.08 0-.199.014-.345.046a1.029 1.029 0 0 0-.428.201c-.134.11-.248.282-.342.516-.093.235-.14.57-.14 1.005v5.157H5.082V7.81zm15.693 15.64V.55H21.72V0H24v24h-2.28v-.55z" />
    </svg>
  );
}

function GoogleScholarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
    </svg>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Noah Provenzano - PhD Student" },
    {
      name: "description",
      content:
        "PhD student at Virginia Tech researching deep think techniques and advanced reasoning in LLMs",
    },
  ];
}

// Animation hook for scroll-triggered animations
function useScrollAnimation() {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(
    new Set(),
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
      },
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
    <div className="flex flex-col items-center justify-center px-4 py-4 sm:py-6">
      <div className="max-w-3xl w-full">
        <div
          id="hero-content"
          data-animate
          className={`transition-all duration-1000 ${
            visibleElements.has("hero-content")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {/* Profile picture and info side by side, centered */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-12 justify-center">
            <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-full border-2 border-coral shadow-lg">
              <img
                src="/images/headshot-smile.png"
                alt="Noah Provenzano"
                className="w-full h-full object-cover object-center scale-125"
                style={{ objectPosition: "30% 80%" }}
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl md:text-2xl font-bold mb-1 sm:mb-1">
                Noah Provenzano
              </h1>
              <p className="text-dim-gray text-sm md:text-base mb-1.5">
                PhD Student in Computer Science
              </p>
              <p className="text-dim-gray text-xs md:text-sm mb-3">
                Virginia Tech
              </p>

              {/* Social links - icon only */}
              <div className="flex gap-3 items-center justify-center sm:justify-start flex-wrap">
                <a
                  href="https://x.com/noahpro99"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dim-gray hover:text-coral transition-colors inline-flex"
                  aria-label="X (Twitter)"
                >
                  <XIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://github.com/noahpro99"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dim-gray hover:text-coral transition-colors inline-flex"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/noah-provenzano-90"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dim-gray hover:text-coral transition-colors inline-flex"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://matrix.to/#/@noahpro:matrix.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dim-gray hover:text-coral transition-colors inline-flex"
                  aria-label="Matrix"
                >
                  <MatrixIcon className="w-5 h-5" />
                </a>
                <button
                  className="text-dim-gray hover:text-coral transition-colors cursor-not-allowed opacity-50 inline-flex"
                  aria-label="Google Scholar (Coming Soon)"
                  disabled
                >
                  <GoogleScholarIcon className="w-5 h-5" />
                </button>
                <a
                  href="mailto:noahpro@vt.edu"
                  className="text-dim-gray hover:text-coral transition-colors inline-flex"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href="tel:+15403156063"
                  className="text-dim-gray hover:text-coral transition-colors inline-flex"
                  aria-label="Phone"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResearchSection({
  visibleElements,
}: {
  visibleElements: Set<string>;
}) {
  return (
    <div className="py-2 sm:py-3">
      <div className="max-w-4xl mx-auto px-4">
        <div
          id="research-title"
          data-animate
          className={`mb-3 sm:mb-4 transition-all duration-1000 ${
            visibleElements.has("research-title")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1.5 sm:mb-2">
            Current Research
          </h2>
          <p className="text-sm text-dim-gray leading-relaxed">
            I am researching deep think techniques and methods for advanced
            reasoning in LLMs under{" "}
            <a
              href="https://tuvllms.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-coral underline hover:text-coral/80 transition-colors"
            >
              Dr. Tu Vu
            </a>{" "}
            at Virginia Tech.
          </p>
        </div>

        <div
          id="research-papers"
          data-animate
          className={`transition-all duration-1000 delay-300 ${
            visibleElements.has("research-papers")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="text-lg font-bold text-white mb-3">Publications</h3>
          <div className="space-y-3">
            <a
              href="https://arxiv.org/abs/2603.02479"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-jet/50 border border-dim-gray/20 rounded-lg hover:border-coral transition-all group"
            >
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-coral flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-white group-hover:text-coral transition-colors mb-1">
                    PRISM: Pushing the Frontier of Deep Think via Process Reward
                    Model-Guided Inference
                  </h4>
                  <p className="text-xs text-dim-gray/80 mb-2">
                    Rituraj Sharma, Weiyuan Chen,{" "}
                    <span className="text-coral">Noah Provenzano</span>, Tu Vu
                  </p>
                  <p className="text-sm text-dim-gray leading-relaxed">
                    Introduces PRISM, a Process Reward Model-guided inference
                    algorithm that uses step-level verification to guide
                    population refinement and solution aggregation in deep think
                    systems, achieving 90.0% on AIME25 and reaching the
                    compute-accuracy Pareto frontier.
                  </p>
                  <p className="text-xs text-coral mt-2">
                    arXiv:2603.02479 • March 2026
                  </p>
                </div>
              </div>
            </a>
            <a
              href="https://arxiv.org/abs/2603.02766"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-jet/50 border border-dim-gray/20 rounded-lg hover:border-coral transition-all group"
            >
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-coral flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-white group-hover:text-coral transition-colors mb-1">
                    EvoSkill: Automated Skill Discovery for Multi-Agent Systems
                  </h4>
                  <p className="text-xs text-dim-gray/80 mb-2">
                    Salaheddin Alzubi,{" "}
                    <span className="text-coral">Noah Provenzano</span>, Jaydon
                    Bingham, Weiyuan Chen, Tu Vu
                  </p>
                  <p className="text-sm text-dim-gray leading-relaxed">
                    A self-evolving framework that automatically discovers and
                    refines agent skills through iterative failure analysis,
                    improving exact-match accuracy by 7.3% on OfficeQA and 12.1%
                    on SealQA with demonstrated zero-shot transfer capabilities.
                  </p>
                  <p className="text-xs text-coral mt-2">
                    arXiv:2603.02766 • March 2026
                  </p>
                </div>
              </div>
            </a>
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
    <div className="min-h-screen bg-night text-white">
      {/* Hero Section - Compact, no navigation */}
      <div className="relative px-4 pt-4 sm:pt-6 pb-0">
        <HeroSection />
      </div>

      {/* Current Research Section */}
      <ResearchSection visibleElements={visibleElements} />

      {/* Timeline Section - Vertical, more compact */}
      <div className="relative py-3 sm:py-4">
        <VerticalTimeline visibleElements={visibleElements} />
      </div>

      {/* Personal Blog Section - Below everything else */}
      <div className="py-3 sm:py-4 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div
            id="blog-title"
            data-animate
            className={`mb-4 transition-all duration-1000 ${
              visibleElements.has("blog-title")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              Personal Blog & Projects
            </h2>
          </div>

          <div className="space-y-3 mb-4">
            {getFrontPageContent().map((item, index) => (
              <div
                key={item.id}
                id={`blog-item-${item.id}`}
                data-animate
                className={`transition-all duration-1000 ${
                  visibleElements.has(`blog-item-${item.id}`)
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <a
                  href={
                    item.type === "blog" && item.blogPath
                      ? `/content/${item.id}`
                      : item.githubRepo
                        ? `https://github.com/${item.githubRepo}`
                        : item.link || `/content/${item.id}`
                  }
                  target={item.type === "project" ? "_blank" : undefined}
                  rel={
                    item.type === "project" ? "noopener noreferrer" : undefined
                  }
                  className="flex gap-3 bg-jet/50 rounded-lg p-3 border border-dim-gray/20 hover:border-coral transition-all group"
                >
                  {/* Image thumbnail */}
                  {item.image && (
                    <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4 mb-1">
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-sm group-hover:text-coral transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-dim-gray/80 mt-0.5">
                          {item.category}
                        </p>
                      </div>
                      <span className="text-xs text-dim-gray whitespace-nowrap flex-shrink-0">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-dim-gray text-xs leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="/blog-projects"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-dim-gray hover:text-coral border border-dim-gray/20 hover:border-coral rounded-lg transition-all"
            >
              <span>See All</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
