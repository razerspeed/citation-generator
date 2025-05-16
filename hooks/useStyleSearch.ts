import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import { Style, FuseResultItem } from "@/types/styles";

export function useStyleSearch(
  styles: Style[],
  initialSearchTerm: string = ""
) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filteredStyles, setFilteredStyles] = useState<Style[]>(styles);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const fuseRef = useRef<Fuse<Style> | null>(null);

  useEffect(() => {
    // Initialize Fuse.js instance
    fuseRef.current = new Fuse(styles, {
      keys: ["name"],
      threshold: 0.4, // Slightly higher threshold to capture more results
      includeScore: true, // Include score in results
      ignoreLocation: true, // Don't prioritize matches by their location in string
    });
  }, [styles]);

  // Custom sort function to prioritize results properly
  const customSortResults = (
    results: FuseResultItem[],
    term: string
  ): Style[] => {
    if (!term.trim()) return styles;

    const lowerTerm = term.toLowerCase();

    // Group results into categories
    const exactMatches: Style[] = [];
    const startsWithMatches: Style[] = [];
    const wordStartsWithMatches: Style[] = [];
    const containsMatches: Style[] = [];

    results.forEach((result) => {
      const style = result.item;
      const nameLower = style.name.toLowerCase();

      // Exact match
      if (nameLower === lowerTerm) {
        exactMatches.push(style);
      }
      // Starts with term
      else if (nameLower.startsWith(lowerTerm)) {
        startsWithMatches.push(style);
      }
      // Any word starts with term
      else if (
        nameLower.split(" ").some((word: string) => word.startsWith(lowerTerm))
      ) {
        wordStartsWithMatches.push(style);
      }
      // Contains term elsewhere
      else {
        containsMatches.push(style);
      }
    });

    // Combine all groups in priority order
    return [
      ...exactMatches,
      ...startsWithMatches,
      ...wordStartsWithMatches,
      ...containsMatches,
    ];
  };

  useEffect(() => {
    // Filter styles based on search term
    setIsLoading(true);

    // Debounce search for better performance with large datasets
    const timer = setTimeout(() => {
      if (!searchTerm.trim()) {
        setFilteredStyles(styles);
      } else if (fuseRef.current) {
        const results = fuseRef.current.search(searchTerm);
        const sortedResults = customSortResults(results, searchTerm);
        setFilteredStyles(sortedResults);
      }
      setHighlightedIndex(-1);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchTerm, styles]);

  return {
    searchTerm,
    setSearchTerm,
    filteredStyles,
    isLoading,
    highlightedIndex,
    setHighlightedIndex,
    isDropdownOpen,
    setIsDropdownOpen,
  };
}
