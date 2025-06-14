
import React from 'react';
import { Trash2, Copy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ContextMenuProps {
  x: number;
  y: number;
  onDelete: () => void;
  onClose: () => void;
}

export const ContextMenu = ({ x, y, onDelete, onClose }: ContextMenuProps) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this row?')) {
      onDelete();
    }
    onClose();
  };

  return (
    <Card 
      className="fixed z-50 p-1 shadow-lg border bg-white dark:bg-slate-800 min-w-[120px]"
      style={{ left: x, top: y }}
    >
      <div className="flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="justify-start gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="w-4 h-4" />
          Delete Row
        </Button>
      </div>
    </Card>
  );
};
