import { ExternalLink, Mail, Phone } from "lucide-react";

// Custom brand icon components
export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// Navigation component
export function Navigation() {
  return (
    <div className="bg-white">
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <img
              src="/logo.jpg"
              alt="Noah Provenzano"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <a
              href="/"
              className="text-night hover:text-coral transition-colors font-medium"
            >
              HOME
            </a>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <a
            href="/blog-projects"
            className="text-dim-gray hover:text-coral transition-colors font-medium"
          >
            BLOG & PROJECTS
          </a>
          <a
            href="/#footer"
            onClick={(e) => {
              const footerElement = document.getElementById("footer");
              if (footerElement) {
                // If footer exists on current page, scroll to it
                e.preventDefault();
                footerElement.scrollIntoView({ behavior: "smooth" });
              }
              // If footer doesn't exist, let the default navigation happen to /#footer
              // The browser will automatically scroll to the anchor when the page loads
            }}
            className="text-dim-gray hover:text-coral transition-colors font-medium"
          >
            CONTACT
          </a>
        </div>
      </nav>
    </div>
  );
}

// Footer component
export function Footer() {
  return (
    <div className="bg-white py-16" id="footer">
      <div className="text-center max-w-4xl mx-auto px-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-night mb-4">Let's Connect</h3>
          <p className="text-dim-gray mb-6">
            Always interested in new opportunities and collaborations
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8">
          <a
            href="mailto:noahpro@gmail.com"
            className="text-night hover:text-coral transition-colors font-medium flex items-center gap-2"
          >
            <Mail className="w-5 h-5" />
            noahpro@gmail.com
          </a>
          <a
            href="tel:540-315-6063"
            className="text-night hover:text-coral transition-colors font-medium flex items-center gap-2"
          >
            <Phone className="w-5 h-5" />
            (540) 315-6063
          </a>
        </div>

        <div className="flex justify-center space-x-6 mb-8">
          <a
            href="https://github.com/noahpro99"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dim-gray hover:text-coral transition-colors flex items-center gap-2"
          >
            <GithubIcon className="w-5 h-5" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/noah-provenzano-90"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dim-gray hover:text-coral transition-colors flex items-center gap-2"
          >
            <LinkedinIcon className="w-5 h-5" />
            LinkedIn
          </a>
        </div>

        <p className="text-xs text-dim-gray">© 2025 Noah Provenzano</p>
      </div>
    </div>
  );
}

// Loading component
export function LoadingSpinner({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-white text-night flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral mx-auto mb-4"></div>
        <p className="text-dim-gray">{message}</p>
      </div>
    </div>
  );
}

// Not found component
export function NotFound({ type }: { type: "blog" | "project" }) {
  return (
    <div className="min-h-screen bg-white text-night flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          {type === "blog" ? "Blog Post" : "Project"} Not Found
        </h1>
        <p className="text-dim-gray mb-6">
          The {type} you're looking for doesn't exist.
        </p>
        <a
          href="/blog-projects"
          className="bg-coral hover:bg-coral/90 text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          Back to Blog & Projects
        </a>
      </div>
    </div>
  );
}
