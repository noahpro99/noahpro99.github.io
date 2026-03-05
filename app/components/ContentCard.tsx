import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";

export interface ContentItem {
  id: string;
  type: "project" | "blog";
  title: string;
  description: string;
  date: string;
  category: string;
  badge?: string;
  link?: string;
  image?: string;
  blogPath?: string;
  showOnFrontPage?: boolean;
  showOnTimeline?: boolean;
  githubRepo?: string; // Format: "owner/repo"
}

interface ContentCardProps {
  item: ContentItem;
  index: number;
  visibleElements: Set<string>;
}

export function ContentCard({
  item,
  index,
  visibleElements,
}: ContentCardProps) {
  const navigate = useNavigate();
  const isVisible = visibleElements.has(`content-${item.id}`);

  return (
    <div
      id={`content-${item.id}`}
      data-animate
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className="bg-jet/50 border border-dim-gray/20 rounded-lg p-4 hover:border-coral transition-all cursor-pointer group h-full flex flex-col"
        onClick={() => {
          if (item.type === "project" && item.githubRepo) {
            window.open(`https://github.com/${item.githubRepo}`, "_blank");
          } else {
            navigate(`/content/${item.id}`);
          }
        }}
      >
        {/* Image Section - smaller */}
        {item.image && (
          <div className="relative h-32 w-full mb-3 rounded overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Hide image on error
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-coral text-xs font-medium">
              {item.category}
            </span>
            {item.badge && (
              <span className="bg-coral/20 text-coral text-xs px-2 py-0.5 rounded">
                {item.badge}
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-white mb-2 group-hover:text-coral transition-colors leading-tight">
            {item.title}
          </h3>

          <p className="text-dim-gray text-xs leading-relaxed mb-3 flex-1 line-clamp-3">
            {item.description}
          </p>

          <div className="flex items-center justify-between text-xs text-dim-gray">
            <span>{item.date}</span>
            <span className="capitalize">{item.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
