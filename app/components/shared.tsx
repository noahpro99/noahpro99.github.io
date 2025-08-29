import {
  ExternalLink,
  Mail,
  Phone,
  ArrowRight,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";

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

// CTA Button component
interface CTAButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  icon?: LucideIcon;
  external?: boolean;
  className?: string;
  animated?: boolean;
}

export function CTAButton({
  children,
  href,
  onClick,
  variant = "primary",
  icon: Icon = ArrowRight,
  external = false,
  className = "",
  animated = false,
}: CTAButtonProps) {
  const baseClasses =
    "inline-flex items-center gap-2 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-full font-medium transition-all duration-300 cursor-pointer text-sm sm:text-base";

  const variantClasses = {
    primary: animated
      ? "group relative bg-coral hover:bg-coral/90 text-white shadow-lg hover:shadow-xl hover:shadow-coral/25 hover:scale-105 transform-gpu before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-coral/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
      : "bg-coral hover:bg-coral/90 text-white",
    secondary: "bg-jet hover:bg-jet/80 text-white",
  };

  const content = (
    <>
      {animated && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-coral via-coral/80 to-coral opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
      )}
      <span className={animated ? "relative z-10" : ""}>{children}</span>
      <Icon
        className={`w-4 h-4 sm:w-5 sm:h-5 ${animated ? "relative z-10 group-hover:translate-x-1 transition-transform duration-300" : ""}`}
      />
    </>
  );

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    const isExternal = external || /^(https?:)?\/\//.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {content}
        </a>
      );
    }
    return (
      <Link to={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {content}
    </button>
  );
}

// Navigation component
export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="bg-white">
        <nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
          {/* Logo */}
          <div
            className={`flex items-center space-x-3 transform transition-all duration-700 ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
          >
            <Link
              to="/"
              className="text-night hover:text-coral transition-colors font-medium flex items-center gap-2 group"
            >
              <img
                src="/logo.jpg"
                alt="Noah Provenzano"
                className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
              />
              <span className="text-sm md:text-base">noahpro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/blog-projects"
              className={`text-dim-gray hover:text-coral transition-all duration-300 font-medium transform ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
            >
              Blog & Projects
            </Link>
            <a
              href="/#footer"
              onClick={(e) => {
                const footerElement = document.getElementById("footer");
                if (footerElement) {
                  e.preventDefault();
                  footerElement.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={`text-dim-gray hover:text-coral transition-all duration-300 font-medium transform ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`md:hidden relative z-50 p-2 text-night hover:text-coral transition-all duration-700 transform ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
            style={{ transitionDelay: "450ms" }}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 relative">
              {/* Animated hamburger icon */}
              <span
                className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "rotate-45 top-2.5" : "top-1"
                }`}
              />
              <span
                className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out top-2.5 ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "-rotate-45 top-2.5" : "top-4"
                }`}
              />
            </div>
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 pt-20">
          <nav className="space-y-6">
            <Link
              to="/"
              onClick={closeMenu}
              className="block text-night hover:text-coral transition-colors font-medium text-lg"
            >
              Home
            </Link>
            <Link
              to="/blog-projects"
              onClick={closeMenu}
              className="block text-night hover:text-coral transition-colors font-medium text-lg"
            >
              Blog & Projects
            </Link>
            <a
              href="/#footer"
              onClick={(e) => {
                const footerElement = document.getElementById("footer");
                if (footerElement) {
                  e.preventDefault();
                  footerElement.scrollIntoView({ behavior: "smooth" });
                }
                closeMenu();
              }}
              className="block text-night hover:text-coral transition-colors font-medium text-lg"
            >
              Contact
            </a>
          </nav>

          {/* Social Links in Mobile Menu */}
          <div className="mt-12 pt-6 border-t border-dim-gray/20">
            <div className="space-y-4">
              <a
                href="https://github.com/noahpro99"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-dim-gray hover:text-coral transition-colors"
              >
                <GithubIcon className="w-5 h-5" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/noah-provenzano-90"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-dim-gray hover:text-coral transition-colors"
              >
                <LinkedinIcon className="w-5 h-5" />
                LinkedIn
              </a>
              <a
                href="mailto:noahpro@gmail.com"
                className="flex items-center gap-3 text-dim-gray hover:text-coral transition-colors"
              >
                <Mail className="w-5 h-5" />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Footer component
export function Footer() {
  return (
    <div className="bg-white py-8 sm:py-12 md:py-16" id="footer">
          <div className="text-center max-w-4xl mx-auto px-3 sm:px-4 md:px-8">
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-night mb-3 sm:mb-4">
                Let's Connect
              </h3>
              <p className="text-dim-gray mb-4 sm:mb-6 text-sm sm:text-base">
                Always interested in new opportunities and collaborations
              </p>
            </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <a
            href="mailto:noahpro@gmail.com"
            className="text-night hover:text-coral transition-colors font-medium flex items-center gap-2 text-sm sm:text-base"
          >
            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            noahpro@gmail.com
          </a>
          <a
            href="tel:540-315-6063"
            className="text-night hover:text-coral transition-colors font-medium flex items-center gap-2 text-sm sm:text-base"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            (540) 315-6063
          </a>
        </div>

        <div className="flex justify-center space-x-4 sm:space-x-6 mb-6 sm:mb-8">
          <a
            href="https://github.com/noahpro99"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dim-gray hover:text-coral transition-colors flex items-center gap-2 text-sm sm:text-base"
          >
            <GithubIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/noah-provenzano-90"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dim-gray hover:text-coral transition-colors flex items-center gap-2 text-sm sm:text-base"
          >
            <LinkedinIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
        <Link
          to="/blog-projects"
          className="bg-coral hover:bg-coral/90 text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          Back to Blog & Projects
        </Link>
      </div>
    </div>
  );
}
