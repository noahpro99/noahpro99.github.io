import type { Route } from "./+types/blog-projects";
import { useState, useEffect } from "react";
import { ContentCard } from "../components/ContentCard";
import { Breadcrumb } from "../components/Breadcrumb";
import { allContent } from "../config/content";


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
    <div className="min-h-screen bg-night text-white">
      {/* Main Content */}
      <div className="relative px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <Breadcrumb
                items={[
                  { label: "Home", href: "/" },
                  { label: "Blog & Projects" },
                ]}
              />

              {/* Header Section */}
              <div
                id="page-title"
                data-animate
                className={`mb-6 transition-all duration-1000 ${
                  visibleElements.has("page-title")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Blog & Projects
                </h1>
                <p className="text-sm text-dim-gray">
                  A collection of my work and writing on technology and research.
                </p>
              </div>

              {/* Filter Buttons */}
              <div
                id="filter-buttons"
                data-animate
                className={`flex justify-start mb-4 transition-all duration-1000 ${
                  visibleElements.has("filter-buttons")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="flex space-x-2 bg-jet rounded-lg p-1">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                      filter === "all"
                        ? "bg-coral text-white"
                        : "text-dim-gray hover:text-white"
                    }`}
                  >
                    All ({allContent.length})
                  </button>
                  <button
                    onClick={() => setFilter("projects")}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
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
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
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

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
  );
}
