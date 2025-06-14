
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EditableCellProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}

export const EditableCell = ({ 
  value, 
  onChange, 
  placeholder, 
  multiline = false,
  onFocus,
  onBlur,
  className 
}: EditableCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleSave();
    onBlur?.();
  };

  const handleFocus = () => {
    onFocus?.();
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (multiline) {
        inputRef.current.setSelectionRange(editValue.length, editValue.length);
      } else {
        inputRef.current.select();
      }
    }
  }, [isEditing, editValue.length, multiline]);

  if (isEditing) {
    const Component = multiline ? 'textarea' : 'input';
    return (
      <Component
        ref={inputRef as any}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full p-2 text-sm bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none",
          multiline && "min-h-[60px]",
          className
        )}
        placeholder={placeholder}
        rows={multiline ? 3 : undefined}
      />
    );
  }

  return (
    <div
      className={cn(
        "w-full p-2 text-sm min-h-[40px] cursor-text hover:bg-gray-50 dark:hover:bg-slate-700 rounded transition-colors flex items-start",
        !value && "text-gray-400 dark:text-gray-500",
        className
      )}
      onDoubleClick={handleDoubleClick}
      onFocus={handleFocus}
      tabIndex={0}
    >
      {value || placeholder}
    </div>
  );
};
