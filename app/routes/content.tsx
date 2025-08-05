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
  const [content, setContent] = useState<any>(null);

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
          setMarkdownContent(text);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading blog post:", error);
          setMarkdownContent(
            "# Blog Post\n\nUnable to load blog post content."
          );
          setLoading(false);
        });
    } else if (item.type === "project" && item.githubRepo) {
      // Load project README from GitHub
      const [owner, repo] = item.githubRepo.split("/");
      const readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;

      fetch(readmeUrl)
        .then((response) => {
          if (!response.ok) {
            // Try master branch if main doesn't exist
            return fetch(
              `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`
            );
          }
          return response;
        })
        .then((response) => response.text())
        .then((text) => {
          setMarkdownContent(text);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading README:", error);
          setMarkdownContent(
            `# ${item.title}\n\n${item.description}\n\n*Unable to load project README from GitHub.*`
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

      {/* Content - Dark rounded container */}
      <div className="relative px-4 md:px-8 pb-4 md:pb-8">
        <div className="bg-night rounded-[2rem] md:rounded-[3rem] text-white overflow-hidden">
          <div className="px-8 py-20">
            <article className="max-w-4xl mx-auto">
              {/* Content Header */}
              <div className="mb-12 text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-coral text-sm font-medium">
                    {content.category} • {content.date}
                  </span>
                  {content.badge && (
                    <span className="bg-coral/20 text-coral text-xs px-3 py-1 rounded-full">
                      {content.badge}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {content.title}
                </h1>
                <p className="text-dim-gray text-lg max-w-2xl mx-auto mb-8">
                  {content.description}
                </p>

                {/* Content Links */}
                <div className="flex justify-center gap-4">
                  {content.link && (
                    <a
                      href={content.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-coral hover:bg-coral/90 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
                    >
                      {content.type === "project"
                        ? "View Live Project"
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
                  )}
                  {content.githubRepo && (
                    <a
                      href={`https://github.com/${content.githubRepo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-jet hover:bg-jet/80 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
                    >
                      <GithubIcon className="w-4 h-4" />
                      View Source
                    </a>
                  )}
                </div>
              </div>

              {/* Markdown Content */}
              <div className="prose prose-lg prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h2 className="text-2xl md:text-3xl font-semibold text-white mt-12 mb-6">
                        {children}
                      </h2>
                    ),
                    h2: ({ children }) => (
                      <h3 className="text-xl md:text-2xl font-semibold text-white mt-10 mb-4">
                        {children}
                      </h3>
                    ),
                    h3: ({ children }) => (
                      <h4 className="text-lg md:text-xl font-semibold text-white mt-8 mb-3">
                        {children}
                      </h4>
                    ),
                    p: ({ children }) => (
                      <p className="text-dim-gray leading-relaxed mb-6 text-base">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="text-dim-gray space-y-2 mb-6 list-disc list-inside">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="text-dim-gray space-y-2 mb-6 list-decimal list-inside">
                        {children}
                      </ol>
                    ),
                    code: ({ className, children }) => {
                      if (className?.includes("language-")) {
                        return (
                          <pre className="bg-jet rounded-lg p-4 overflow-x-auto mb-6">
                            <code className="text-white text-sm">
                              {children}
                            </code>
                          </pre>
                        );
                      }
                      return (
                        <code className="bg-jet text-coral px-2 py-1 rounded text-sm">
                          {children}
                        </code>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-coral pl-6 italic text-dim-gray mb-6">
                        {children}
                      </blockquote>
                    ),
                    img: ({ src, alt }) => (
                      <div className="my-8">
                        <img
                          src={src}
                          alt={alt}
                          className="rounded-lg mx-auto max-w-full"
                        />
                      </div>
                    ),
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
