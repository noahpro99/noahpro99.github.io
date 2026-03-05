import type { Route } from "./+types/content";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getContentById } from "../config/content";
import {
  LoadingSpinner,
  NotFound,
  GithubIcon,
} from "../components/shared";
import type { ContentItem } from "~/components/ContentCard";
import { Link } from "react-router";

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
    <div className="min-h-screen bg-night text-white">
      {/* Content */}
      <div className="relative px-4 py-6 sm:py-8">
        <article className="max-w-4xl mx-auto">
              {/* Back to posts link */}
              <div className="mb-4">
                <Link
                  to="/blog-projects"
                  className="text-dim-gray hover:text-coral text-sm transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Back to all posts
                </Link>
              </div>

              {/* Content Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-coral text-xs font-medium">
                    {content.category}
                  </span>
                  <span className="text-dim-gray text-xs">{content.date}</span>
                  {content.badge && (
                    <span className="bg-coral/20 text-coral text-xs px-2 py-0.5 rounded">
                      {content.badge}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                  {content.title}
                </h1>
                <p className="text-dim-gray text-sm leading-relaxed mb-4">
                  {content.description}
                </p>

                {/* Content Links */}
                <div className="flex gap-3">
                  {content.githubRepo ? (
                    <a
                      href={`https://github.com/${content.githubRepo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-jet/50 hover:bg-jet border border-dim-gray/20 hover:border-coral text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                    >
                      <GithubIcon className="w-4 h-4" />
                      View on GitHub
                    </a>
                  ) : content.link ? (
                    <a
                      href={content.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-coral hover:bg-coral/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                    >
                      {content.type === "project"
                        ? "View Project"
                        : "View External Link"}
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="m7 7 10 10M7 17l10-10" />
                      </svg>
                    </a>
                  ) : null}
                </div>
              </div>

              {/* Markdown Content */}
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                        {children}
                      </h2>
                    ),
                    h2: ({ children }) => (
                      <h3 className="text-lg font-semibold text-white mt-6 mb-3">
                        {children}
                      </h3>
                    ),
                    h3: ({ children }) => (
                      <h4 className="text-base font-semibold text-white mt-6 mb-2">
                        {children}
                      </h4>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-coral">{children}</strong>
                    ),
                    p: ({ children }) => (
                      <p className="text-dim-gray leading-relaxed mb-4 text-sm">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="text-dim-gray space-y-1 mb-4 list-disc list-inside text-sm">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="text-dim-gray space-y-1 mb-4 list-decimal list-inside text-sm">
                        {children}
                      </ol>
                    ),
                    code: ({ className, children }) => {
                      if (className?.includes("language-")) {
                        return (
                          <pre className="bg-jet rounded-lg p-3 overflow-x-auto mb-4 scrollbar-thin">
                            <code className="text-white text-xs">
                              {children}
                            </code>
                          </pre>
                        );
                      }
                      return (
                        <code className="bg-jet text-coral px-1.5 py-0.5 rounded text-xs">
                          {children}
                        </code>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-coral pl-4 italic text-dim-gray mb-4 text-sm">
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
                        <div className="my-6">
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
  );
}
