import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  BookOpen,
  Library,
  Search,
  MapPin,
  FileText,
  Edit,
  FolderKanban,
  Menu,
  X,
} from "lucide-react";

interface TopNavbarProps {
  currentPath?: string;
  onSignOut?: () => Promise<void>;
}

export function TopNavbar({ currentPath = "", onSignOut }: TopNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigationItems = [
    {
      name: "Home",
      icon: <Home className="w-5 h-5 mr-2" />,
      href: "/dashboard",
    },
    {
      name: "Literature Review",
      icon: <BookOpen className="w-5 h-5 mr-2" />,
      href: "/dashboard/review",
    },
    {
      name: "Library",
      icon: <Library className="w-5 h-5 mr-2" />,
      href: "/dashboard/library",
    },
    {
      name: "Search Papers",
      icon: <Search className="w-5 h-5 mr-2" />,
      href: "/dashboard/search",
    },
    {
      name: "Citation Map",
      icon: <MapPin className="w-5 h-5 mr-2" />,
      href: "/dashboard/map",
    },
    {
      name: "Citation Generator",
      icon: <FileText className="w-5 h-5 mr-2" />,
      href: "/dashboard/styles",
    },
    {
      name: "Editor",
      icon: <Edit className="w-5 h-5 mr-2" />,
      href: "/dashboard/editor",
    },
    {
      name: "Projects",
      icon: <FolderKanban className="w-5 h-5 mr-2" />,
      href: "/dashboard/projects",
    },
  ];

  return (
    <header className="relative flex items-center h-16 px-6 border-b border-gray-200 bg-white w-full">
      {/* Logo and Website Name - Always visible */}
      <div className="flex items-center">
        <Link href="/dashboard" className="flex items-center">
          <svg
            className="w-6 h-6 text-purple-700"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L2 22h20L12 2z" />
          </svg>
        </Link>
        <div className="ml-2">
          <Link
            href="/dashboard"
            className="text-purple-700 font-semibold text-lg"
          >
            CitationPro
          </Link>
        </div>
      </div>

      {/* Desktop Navigation - Hidden on small screens */}
      <nav className="hidden md:block flex-1 ml-10">
        <ul className="flex items-center justify-between">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm transition-colors ${
                  currentPath === item.href
                    ? "text-purple-700 font-medium"
                    : "text-gray-600 hover:text-purple-700"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sign Out Button */}
      {onSignOut && (
        <button
          onClick={onSignOut}
          className="ml-4 px-4 py-2 text-sm text-gray-600 hover:text-purple-700 transition-colors"
        >
          Sign Out
        </button>
      )}

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="p-2 text-gray-600 hover:text-purple-700 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden">
          <nav className="px-4 py-2">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-2 py-2 text-sm transition-colors ${
                      currentPath === item.href
                        ? "text-purple-700 font-medium"
                        : "text-gray-600 hover:text-purple-700"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
              {/* Sign Out Button in Mobile Menu */}
              {onSignOut && (
                <li>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onSignOut();
                    }}
                    className="flex items-center px-2 py-2 text-sm text-gray-600 hover:text-purple-700 transition-colors w-full text-left"
                  >
                    Sign Out
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
