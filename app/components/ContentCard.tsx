import { ExternalLink } from "lucide-react";

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
  showOnFrontPage: boolean;
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
  const isVisible = visibleElements.has(`content-${item.id}`);

  return (
    <div
      id={`content-${item.id}`}
      data-animate
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div
        className="bg-jet rounded-2xl overflow-hidden hover:bg-jet/80 transition-all cursor-pointer group h-full flex flex-col"
        onClick={() => {
          if (item.type === "project" && item.githubRepo) {
            // Open GitHub projects in a new tab
            window.open(`https://github.com/${item.githubRepo}`, "_blank");
          } else {
            // Navigate to content page for blogs and other content
            window.location.href = `/content/${item.id}`;
          }
        }}
      >
        {/* Image Section */}
        <div className="relative h-48 w-full">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback for missing images
                e.currentTarget.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNzE2OTY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZiZmJmYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIENvbWluZyBTb29uPC90ZXh0Pjwvc3ZnPg==";
              }}
            />
          ) : (
            <div className="w-full h-full bg-dim-gray flex items-center justify-center">
              <span className="text-white text-sm">Image Coming Soon</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-coral text-sm font-medium">
              {item.category}
            </span>
            {item.badge && (
              <span className="bg-coral/20 text-coral text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-coral transition-colors leading-tight">
            {item.title}
          </h3>

          <p className="text-dim-gray text-sm mb-4 leading-relaxed flex-1">
            {item.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-xs text-dim-gray">{item.date}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-dim-gray capitalize">
                {item.type}
              </span>
              {(item.link || item.blogPath) && (
                <ExternalLink className="w-3 h-3 text-dim-gray group-hover:text-coral transition-colors" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
