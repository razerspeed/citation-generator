import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Style } from "@/types/styles";
import { useStyleSearch } from "@/hooks/useStyleSearch";

interface StyleSearchProps {
  styles: Style[];
  onSelectStyle: (style: Style) => void;
  selectedStyleId?: string;
  searchTerm?: string;
  onSearchTermChange?: (term: string) => void;
}

export function StyleSearch({
  styles,
  onSelectStyle,
  selectedStyleId,
  searchTerm: externalSearchTerm,
  onSearchTermChange,
}: StyleSearchProps) {
  const {
    searchTerm,
    setSearchTerm,
    filteredStyles,
    isLoading,
    highlightedIndex,
    setHighlightedIndex,
    isDropdownOpen,
    setIsDropdownOpen,
  } = useStyleSearch(styles, externalSearchTerm);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsDropdownOpen]);

  useEffect(() => {
    // Scroll to highlighted item when using keyboard navigation
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedItem = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedItem) {
        // Calculate if element is in view
        const container = dropdownRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const elementRect = highlightedItem.getBoundingClientRect();

          // Check if element is outside viewport
          if (elementRect.bottom > containerRect.bottom) {
            highlightedItem.scrollIntoView({
              block: "end",
              behavior: "smooth",
            });
          } else if (elementRect.top < containerRect.top) {
            highlightedItem.scrollIntoView({
              block: "start",
              behavior: "smooth",
            });
          }
        }
      }
    }
  }, [highlightedIndex]);

  // Update search term when external search term changes
  useEffect(() => {
    if (externalSearchTerm !== undefined) {
      setSearchTerm(externalSearchTerm);
    }
  }, [externalSearchTerm]);

  const handleStyleSelect = (style: Style) => {
    onSelectStyle(style);
    setSearchTerm(style.name);
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsDropdownOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev: number) =>
          prev < filteredStyles.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev: number) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredStyles.length) {
          handleStyleSelect(filteredStyles[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsDropdownOpen(false);
        break;
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    onSearchTermChange?.(newTerm);
    setIsDropdownOpen(true);
  };

  // Function to highlight the matching text in results
  const highlightMatch = (text: string, term: string) => {
    if (!term.trim()) return text;

    try {
      const regex = new RegExp(
        `(${term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")})`,
        "gi"
      );
      const parts = text.split(regex);

      return (
        <>
          {parts.map((part, i) =>
            regex.test(part) ? (
              <span key={i} className="bg-yellow-100">
                {part}
              </span>
            ) : (
              part
            )
          )}
        </>
      );
    } catch (e) {
      return text; // Fallback if regex fails
    }
  };

  return (
    <div className="relative">
      <div className="relative rounded-md border border-gray-300 bg-white">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search citation styles by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full py-3 px-4 pr-12 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search citation styles"
          role="combobox"
          aria-expanded={isDropdownOpen}
          aria-controls="style-listbox"
          aria-autocomplete="list"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {searchTerm ? (
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ) : (
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-[60vh] overflow-hidden flex flex-col"
          id="style-listbox"
          role="listbox"
        >
          {/* Sticky header with results count */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 py-2 px-3 text-sm flex justify-between items-center">
            <span className="font-medium text-gray-700">
              {isLoading
                ? "Searching..."
                : `${filteredStyles.length} styles found`}
            </span>
            {searchTerm && (
              <span className="text-gray-500">for "{searchTerm}"</span>
            )}
          </div>

          <div className="overflow-y-auto flex-grow">
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}

            {!isLoading && filteredStyles.length > 0 ? (
              <ul ref={listRef} className="divide-y divide-gray-100">
                {filteredStyles.map((style: Style, index: number) => (
                  <li
                    key={style.id}
                    className={`cursor-pointer transition-colors ${
                      highlightedIndex === index
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    } ${
                      selectedStyleId === style.id
                        ? "border-l-4 border-blue-500 pl-3"
                        : "px-4"
                    }`}
                    onClick={() => handleStyleSelect(style)}
                    role="option"
                    aria-selected={selectedStyleId === style.id}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="py-3">
                      <div className="font-medium text-gray-900">
                        {searchTerm
                          ? highlightMatch(style.name, searchTerm)
                          : style.name}
                      </div>
                      <div className="text-sm text-gray-500">{style.id}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              !isLoading && (
                <div className="p-8 text-center text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <p className="mt-2 text-lg font-semibold">No styles found</p>
                  <p className="mt-1">No matches for "{searchTerm}"</p>
                  <button
                    onClick={clearSearch}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear search
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
