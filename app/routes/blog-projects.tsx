import type { Route } from "./+types/blog-projects";
import { useState, useEffect } from "react";
import { ContentCard } from "../components/ContentCard";
import { allContent } from "../config/content";
import { Navigation, Footer } from "../components/shared";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blog & Projects - Noah Provenzano" },
    {
      name: "description",
      content:
        "A complete collection of my projects and blog posts on technology, research, and development",
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

export default function BlogProjects() {
  const visibleElements = useScrollAnimation();
  const [filter, setFilter] = useState<"all" | "projects" | "blog">("all");

  const filteredItems = allContent.filter((item) => {
    if (filter === "all") return true;
    if (filter === "projects") return item.type === "project";
    if (filter === "blog") return item.type === "blog";
    return true;
  });

  const projectsLength = allContent.filter(
    (item) => item.type === "project"
  ).length;
  const blogLength = allContent.filter((item) => item.type === "blog").length;

  return (
    <div className="min-h-screen bg-white text-night">
      <Navigation />

      {/* Main Content - Dark rounded container - Mobile optimized */}
      <div className="relative px-1 sm:px-2 md:px-4 lg:px-8 pb-1 sm:pb-2 md:pb-4 lg:pb-8">
        <div className="bg-night rounded-2xl sm:rounded-2xl md:rounded-2xl lg:rounded-[2rem] xl:rounded-[3rem] text-white overflow-hidden">
          <div className="px-3 sm:px-4 md:px-8 py-8 sm:py-12 md:py-20">
            <div className="max-w-6xl mx-auto">
              {/* Header Section */}
              <div
                id="page-title"
                data-animate
                className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-1000 ${
                  visibleElements.has("page-title")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
                  Blog & Projects
                </h1>
                <p className="text-dim-gray text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2 sm:px-4">
                  A complete collection of my work, research, and thoughts on
                  technology, AI, and software development.
                </p>
              </div>

              {/* Filter Buttons - Mobile optimized */}
              <div
                id="filter-buttons"
                data-animate
                className={`flex justify-center mb-8 sm:mb-12 transition-all duration-1000 ${
                  visibleElements.has("filter-buttons")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-4 bg-jet rounded-lg sm:rounded-full p-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-4 sm:px-6 py-2 rounded-lg sm:rounded-full text-xs sm:text-sm font-medium transition-all ${
                      filter === "all"
                        ? "bg-coral text-white"
                        : "text-dim-gray hover:text-white"
                    }`}
                  >
                    All ({allContent.length})
                  </button>
                  <button
                    onClick={() => setFilter("projects")}
                    className={`px-4 sm:px-6 py-2 rounded-lg sm:rounded-full text-xs sm:text-sm font-medium transition-all ${
                      filter === "projects"
                        ? "bg-coral text-white"
                        : "text-dim-gray hover:text-white"
                    }`}
                  >
                    Projects (
                    {
                      allContent.filter((item) => item.type === "project")
                        .length
                    }
                    )
                  </button>
                  <button
                    onClick={() => setFilter("blog")}
                    className={`px-4 sm:px-6 py-2 rounded-lg sm:rounded-full text-xs sm:text-sm font-medium transition-all ${
                      filter === "blog"
                        ? "bg-coral text-white"
                        : "text-dim-gray hover:text-white"
                    }`}
                  >
                    Blog (
                    {allContent.filter((item) => item.type === "blog").length})
                  </button>
                </div>
              </div>

              {/* Content Grid - Mobile optimized */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {filteredItems.map((item, index) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    index={index}
                    visibleElements={visibleElements}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
