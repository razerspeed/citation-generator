import Link from "next/link";
import { Plus, Library } from "lucide-react";

export default function DashboardHomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Citation Card */}
        <Link
          href="/dashboard/citation-generator"
          className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 mb-4 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <Plus className="w-8 h-8 text-purple-700" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Create Citation</h2>
          <p className="text-gray-600 mb-4">
            Generate a new citation in any style
          </p>
          <span className="text-purple-700 font-medium inline-flex items-center">
            Create new citation →
          </span>
        </Link>

        {/* Library Card */}
        <Link
          href="/dashboard/library"
          className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 mb-4 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <Library className="w-8 h-8 text-purple-700" />
          </div>
          <h2 className="text-xl font-semibold mb-2">My Library</h2>
          <p className="text-gray-600 mb-4">
            Access your saved papers and citations
          </p>
          <span className="text-purple-700 font-medium inline-flex items-center">
            View library →
          </span>
        </Link>
      </div>
    </div>
  );
}
