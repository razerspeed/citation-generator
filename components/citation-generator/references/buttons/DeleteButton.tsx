"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteCitation } from "@/actions/citations";
import { toast } from "react-toastify";

interface DeleteButtonProps {
  id: string;
  onDelete?: () => void;
  className?: string;
}

export function DeleteButton({
  id,
  onDelete,
  className = "text-red-600 hover:text-red-700",
}: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      setIsDeleting(true);
      const { error } = await deleteCitation(id);

      if (error) {
        throw new Error(error);
      }

      toast.success("Citation deleted successfully");
      onDelete?.();
    } catch (err) {
      console.error("Error deleting citation:", err);
      toast.error("Failed to delete citation");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button onClick={handleDelete} className={className}>
      {isDeleting ? (
        <div className="h-4 w-4 border-2 border-t-red-600 rounded-full animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
