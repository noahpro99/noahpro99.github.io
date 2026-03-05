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
    <nav className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm mb-4 leading-tight">
      {items.map((item, index) => (
        <>
          {item.href ? (
            <Link
              key={`item-${index}`}
              to={item.href}
              className="text-dim-gray hover:text-coral transition-colors inline-block"
            >
              {item.label}
            </Link>
          ) : (
            <span key={`item-${index}`} className="text-white inline-block">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span key={`sep-${index}`} className="text-dim-gray inline-block">/</span>
          )}
        </>
      ))}
    </nav>
  );
}
