"use client";

import { useState } from "react";
import styles from "@/data/csl-styles.json";

interface Style {
  id: string;
  name: string;
  filename: string;
}

interface StyleSelectorProps {
  onStyleChange: (style: string) => void;
  defaultStyle?: string;
}

export default function StyleSelector({
  onStyleChange,
  defaultStyle = "apa",
}: StyleSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState(defaultStyle);

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStyle = e.target.value;
    setSelectedStyle(newStyle);
    onStyleChange(newStyle);
  };

  return (
    <div className="w-full max-w-md">
      <label
        htmlFor="citation-style"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Citation Style
      </label>
      <select
        id="citation-style"
        value={selectedStyle}
        onChange={handleStyleChange}
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        {styles.map((style: Style) => (
          <option key={style.id} value={style.id}>
            {style.name}
          </option>
        ))}
      </select>
    </div>
  );
}
