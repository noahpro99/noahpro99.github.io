import type { Route } from "./+types/content";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { visit } from "unist-util-visit";
import type { Root, Image, Text, Paragraph } from "mdast";
import "katex/dist/katex.min.css";
import { getContentById } from "../config/content";
import {
  LoadingSpinner,
  NotFound,
  GithubIcon,
} from "../components/shared";
import { Breadcrumb } from "../components/Breadcrumb";
import type { ContentItem } from "~/components/ContentCard";

function remarkImageAttrs() {
  return (tree: Root) => {
    visit(tree, "paragraph", (node: Paragraph) => {
      for (let i = 0; i < node.children.length - 1; i++) {
        const img = node.children[i];
        const txt = node.children[i + 1];
        if (img.type !== "image" || txt.type !== "text") continue;
        const match = (txt as Text).value.match(/^\s*\{([^}]+)\}/);
        if (!match) continue;
        const attrs = match[1];
        const widthMatch = attrs.match(/width=(\d+%)/);
        const floatMatch = attrs.match(/float=(left|right)/);
        const image = img as Image;
        image.data = image.data ?? {};
        image.data.hProperties = image.data.hProperties ?? {};
        const hp = image.data.hProperties as Record<string, string>;
        if (widthMatch) hp.width = widthMatch[1];
        if (floatMatch) hp.float = floatMatch[1];
        (txt as Text).value = (txt as Text).value.slice(match[0].length);
      }
    });
  };
}

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
              {/* Breadcrumb */}
              <Breadcrumb
                items={[
                  { label: "Home", href: "/" },
                  { label: "Blog & Projects", href: "/blog-projects" },
                  { label: content.title },
                ]}
              />

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
                {content.type !== "blog" && (
                  <>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                      {content.title}
                    </h1>
                    <p className="text-dim-gray text-sm leading-relaxed mb-4">
                      {content.description}
                    </p>
                  </>
                )}

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
                  remarkPlugins={[remarkGfm, remarkMath, remarkImageAttrs]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                        {children}
                      </h1>
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
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full text-sm border-collapse">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="border-b border-coral/40">
                        {children}
                      </thead>
                    ),
                    th: ({ children }) => (
                      <th className="px-3 py-2 text-left font-semibold text-white">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-3 py-2 text-dim-gray border-b border-jet">
                        {children}
                      </td>
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
                    img: ({ src, alt, node }) => {
                      const props = node?.properties ?? {};
                      const width = props.width as string | undefined;
                      const float = props.float as
                        | "left"
                        | "right"
                        | undefined;

                      let resolvedSrc = src;
                      if (
                        src &&
                        src.startsWith("./") &&
                        content.type === "blog" &&
                        content.blogPath
                      ) {
                        const blogDir = content.blogPath.replace(
                          "/blog.md",
                          ""
                        );
                        resolvedSrc = `${blogDir}/${src.slice(2)}`;
                      }

                      if (float) {
                        return (
                          <img
                            src={resolvedSrc}
                            alt={alt ?? ""}
                            className="rounded-lg h-auto"
                            style={{
                              float,
                              width: width ?? "20%",
                              maxWidth: "100%",
                              margin:
                                float === "right"
                                  ? "0 0 1rem 1.5rem"
                                  : "0 1.5rem 1rem 0",
                            }}
                          />
                        );
                      }

                      return (
                        <div className="my-6">
                          <img
                            src={resolvedSrc}
                            alt={alt ?? ""}
                            className="rounded-lg mx-auto max-w-full h-auto"
                            style={
                              width
                                ? { width, maxWidth: "100%" }
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
