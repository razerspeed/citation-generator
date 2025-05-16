import React from "react";
import { Style } from "@/types/styles";

interface SelectedStyleCardProps {
  style: Style;
  onUseStyle: () => void;
}

export function SelectedStyleCard({
  style,
  onUseStyle,
}: SelectedStyleCardProps) {
  return (
    <div className="bg-white border border-gray-300 rounded-md shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">{style.name}</h2>
      <div className="mb-4">
        <div className="text-gray-600 font-medium mb-1">ID:</div>
        <div className="pl-2 py-1 bg-gray-50 rounded">{style.id}</div>
      </div>
      <div className="mb-8">
        <div className="text-gray-600 font-medium mb-1">Filename:</div>
        <div className="pl-2 py-1 bg-gray-50 rounded">{style.filename}</div>
      </div>
      <button
        onClick={onUseStyle}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition font-medium"
      >
        Use This Style
      </button>
    </div>
  );
}
