import { Link } from "react-router";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-baseline flex-wrap gap-2 text-sm mb-4">
      {items.map((item, index) => (
        <span key={index} className="flex items-baseline gap-2">
          {item.href ? (
            <Link
              to={item.href}
              className="text-dim-gray hover:text-coral transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className="text-dim-gray">/</span>
          )}
        </span>
      ))}
    </nav>
  );
}
