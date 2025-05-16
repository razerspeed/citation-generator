import React from "react";
import Link from "next/link";
import {
  Plus,
  BookOpen,
  Library,
  Search,
  Edit,
  FolderKanban,
  User,
  Contact,
  LogOut,
  Home,
  MapPin,
  FileText,
} from "lucide-react";

interface SidebarProps {
  currentPath?: string;
  onLogout?: () => void;
}

export function Sidebar({ currentPath = "", onLogout }: SidebarProps) {
  const navigationItems = [
    {
      name: "New",
      icon: <Plus className="w-6 h-6" />,
      href: "/dashboard/new",
    },
    // {
    //   name: "Home",
    //   icon: <Home className="w-5 h-5" />,
    //   href: "/dashboard",
    // },
    {
      name: "Review",
      icon: <BookOpen className="w-5 h-5" />,
      href: "/dashboard/review",
    },
    {
      name: "Library",
      icon: <Library className="w-5 h-5" />,
      href: "/dashboard/library",
    },
    {
      name: "Search",
      icon: <Search className="w-5 h-5" />,
      href: "/dashboard/search",
    },
    {
      name: "Citation Map",
      icon: <MapPin className="w-5 h-5" />,
      href: "/dashboard/map",
    },
    {
      name: "Citation Generator",
      icon: <FileText className="w-5 h-5" />,
      href: "/dashboard/styles",
    },
    {
      name: "Editor",
      icon: <Edit className="w-5 h-5" />,
      href: "/dashboard/editor",
    },
    {
      name: "Projects",
      icon: <FolderKanban className="w-5 h-5" />,
      href: "/dashboard/projects",
    },
  ];

  const bottomItems = [
    {
      name: "Profile",
      icon: <User className="w-5 h-5" />,
      href: "/dashboard/profile",
    },
    // {
    //   name: "Contact Us",
    //   icon: <Contact className="w-5 h-5" />,
    //   href: "/dashboard/contact",
    // },
    {
      name: "Logout",
      icon: <LogOut className="w-5 h-5" />,
      action: onLogout,
    },
  ];

  return (
    <div className="flex flex-col h-full border-r border-gray-200 w-16 md:w-20 bg-white">
      {/* Website Logo - Small version */}
      {/* <div className="flex items-center justify-center py-4 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center justify-center">
          <svg
            className="w-6 h-6 text-purple-700"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L2 22h20L12 2z" />
          </svg>
        </Link>
      </div> */}

      <nav className="flex-1 flex flex-col justify-between overflow-y-auto">
        <ul className="p-0 m-0">
          {navigationItems.map((item, index) => {
            const isActive = currentPath === item.href;
            return (
              <li key={item.name} className={index === 0 ? "p-0" : ""}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center justify-center w-full ${
                    isActive
                      ? "bg-purple-700 text-white py-6"
                      : "text-gray-600 hover:text-purple-700 py-3"
                  } text-xs`}
                >
                  {isActive ? (
                    <div className="flex flex-col items-center">
                      {index === 0 ? <Plus className="w-6 h-6" /> : item.icon}
                      <span className="mt-1 text-center">{item.name}</span>
                    </div>
                  ) : (
                    <>
                      {index === 0 ? <Plus className="w-6 h-6" /> : item.icon}
                      <span className="mt-1 text-center">{item.name}</span>
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <ul className="py-2 mt-auto">
          {bottomItems.map((item) => {
            const isActive = currentPath === item.href;
            if (item.action) {
              return (
                <li key={item.name}>
                  <button
                    onClick={item.action}
                    className="flex flex-col items-center justify-center py-3 w-full text-xs text-gray-600 hover:text-purple-700"
                  >
                    {item.icon}
                    <span className="mt-1 text-center">{item.name}</span>
                  </button>
                </li>
              );
            }
            return (
              <li key={item.name}>
                <Link
                  href={item.href!}
                  className={`flex flex-col items-center justify-center py-3 w-full text-xs ${
                    isActive
                      ? "bg-purple-700 text-white"
                      : "text-gray-600 hover:text-purple-700"
                  }`}
                >
                  {isActive ? (
                    <div className="flex flex-col items-center">
                      {item.icon}
                      <span className="mt-1 text-center">{item.name}</span>
                    </div>
                  ) : (
                    <>
                      {item.icon}
                      <span className="mt-1 text-center">{item.name}</span>
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
