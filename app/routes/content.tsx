import type { Route } from "./+types/content";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getContentById } from "../config/content";
import {
  Navigation,
  Footer,
  LoadingSpinner,
  NotFound,
  GithubIcon,
} from "../components/shared";
import type { ContentItem } from "~/components/ContentCard";

export function meta({ params }: Route.MetaArgs) {
  const content = getContentById(params.id);

  if (!content) {
    return [
      { title: "Content Not Found - Noah Provenzano" },
      {
        name: "description",
        content: "The content you're looking for doesn't exist.",
      },
    ];
  }

  return [
    { title: `${content.title} - Noah Provenzano` },
    {
      name: "description",
      content: content.description,
    },
  ];
}

export default function ContentPost({ params }: Route.ComponentProps) {
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentItem | null>(null);

  useEffect(() => {
    const contentId = params.id;
    const item = getContentById(contentId);

    if (!item) {
      setLoading(false);
      return;
    }

    setContent(item);

    // Handle different content types
    if (item.type === "blog" && item.blogPath) {
      // Load blog from local markdown file
      fetch(item.blogPath)
        .then((response) => response.text())
        .then((text) => {
          // Process Pandoc-style image attributes
          const processedText = text.replace(
            /!\[([^\]]*)\]\(([^)]+)\)\{([^}]+)\}/g,
            (match, alt, src, attrs) => {
              // Extract width attribute
              const widthMatch = attrs.match(/width=(\d+)%/);
              if (widthMatch) {
                const width = widthMatch[1];
                // Store width in alt text with a special marker
                return `![${alt}||width:${width}%](${src})`;
              }
              return `![${alt}](${src})`;
            }
          );
          setMarkdownContent(processedText);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading blog post:", error);
          setMarkdownContent(
            "# Blog Post\n\nUnable to load blog post content."
          );
          setLoading(false);
        });
    } else {
      // Fallback content
      setMarkdownContent(
        `# ${item.title}\n\n${item.description}\n\n*No additional details available.*`
      );
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <LoadingSpinner
        message={`Loading ${content?.type || "content"} details...`}
      />
    );
  }

  if (!content) {
    return <NotFound type="blog" />;
  }

  return (
    <div className="min-h-screen bg-white text-night">
      <Navigation />

      {/* Content - Dark rounded container - Mobile optimized */}
      <div className="relative px-1 sm:px-2 md:px-4 lg:px-8 pb-1 sm:pb-2 md:pb-4 lg:pb-8">
        <div className="bg-night rounded-2xl sm:rounded-2xl md:rounded-2xl lg:rounded-[2rem] xl:rounded-[3rem] text-white overflow-hidden">
          <div className="px-3 sm:px-4 md:px-8 py-8 sm:py-12 md:py-20">
            <article className="max-w-4xl mx-auto">
              {/* Back to posts link */}
              <div className="mb-6 sm:mb-8">
                <a
                  href="/blog-projects"
                  className="text-dim-gray hover:text-white text-xs sm:text-sm transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Back to all posts
                </a>
              </div>

              {/* Content Header */}
              <div className="mb-8 sm:mb-12 text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <span className="text-coral text-xs sm:text-sm font-medium">
                    {content.category} • {content.date}
                  </span>
                  {content.badge && (
                    <span className="bg-coral/20 text-coral text-xs px-3 py-1 rounded-full">
                      {content.badge}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
                  {content.title}
                </h1>
                <p className="text-dim-gray text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
                  {content.description}
                </p>

                {/* Author and Date */}
                <div className="text-dim-gray text-xs sm:text-sm mb-6 sm:mb-8">
                  <span>By Noah Provenzano • {content.date}</span>
                </div>

                {/* Content Links */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-2">
                  {content.link && (
                    <a
                      href={content.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-coral hover:bg-coral/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {content.type === "project"
                        ? "View Live Project"
                        : "View External Link"}
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="m7 7 10 10M7 17l10-10" />
                      </svg>
                    </a>
                  )}
                  {content.githubRepo && (
                    <a
                      href={`https://github.com/${content.githubRepo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-jet hover:bg-jet/80 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <GithubIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      View Source
                    </a>
                  )}
                </div>
              </div>

              {/* Markdown Content */}
              <div className="prose prose-sm sm:prose-base md:prose-lg prose-invert max-w-none px-2 sm:px-0">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mt-8 sm:mt-12 mb-4 sm:mb-6">
                        {children}
                      </h2>
                    ),
                    h2: ({ children }) => (
                      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mt-6 sm:mt-10 mb-3 sm:mb-4">
                        {children}
                      </h3>
                    ),
                    h3: ({ children }) => (
                      <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white mt-6 sm:mt-8 mb-2 sm:mb-3">
                        {children}
                      </h4>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-coral">{children}</strong>
                    ),
                    p: ({ children }) => (
                      <p className="text-dim-gray leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="text-dim-gray space-y-1 sm:space-y-2 mb-4 sm:mb-6 list-disc list-inside text-sm sm:text-base">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="text-dim-gray space-y-1 sm:space-y-2 mb-4 sm:mb-6 list-decimal list-inside text-sm sm:text-base">
                        {children}
                      </ol>
                    ),
                    code: ({ className, children }) => {
                      if (className?.includes("language-")) {
                        return (
                          <pre className="bg-jet rounded-lg p-3 sm:p-4 overflow-x-auto mb-4 sm:mb-6 scrollbar-thin">
                            <code className="text-white text-xs sm:text-sm">
                              {children}
                            </code>
                          </pre>
                        );
                      }
                      return (
                        <code className="bg-jet text-coral px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">
                          {children}
                        </code>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-coral pl-4 sm:pl-6 italic text-dim-gray mb-4 sm:mb-6 text-sm sm:text-base">
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-coral hover:text-coral/80 underline transition-colors"
                      >
                        {children}
                      </a>
                    ),
                    img: ({ src, alt, title }) => {
                      // Parse width from processed alt text
                      let width = undefined;
                      let cleanAlt = alt;

                      if (alt && alt.includes("||width:")) {
                        const parts = alt.split("||width:");
                        cleanAlt = parts[0];
                        const widthPart = parts[1];
                        if (widthPart) {
                          width = widthPart;
                        }
                      }

                      // Handle relative paths for blog images
                      let resolvedSrc = src;
                      if (
                        src &&
                        src.startsWith("./") &&
                        content.type === "blog" &&
                        content.blogPath
                      ) {
                        // Extract the blog directory from the blogPath
                        const blogDir = content.blogPath.replace(
                          "/blog.md",
                          ""
                        );
                        resolvedSrc = `${blogDir}/${src.slice(2)}`;
                      }

                      return (
                        <div className="my-4 sm:my-6 md:my-8">
                          <img
                            src={resolvedSrc}
                            alt={cleanAlt}
                            className="rounded-lg mx-auto max-w-full h-auto"
                            style={
                              width
                                ? { width: width, maxWidth: "100%" }
                                : { maxWidth: "100%" }
                            }
                          />
                        </div>
                      );
                    },
                  }}
                >
                  {markdownContent}
                </ReactMarkdown>
              </div>
            </article>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
