
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCSVStore } from '@/store/csvStore';

interface IntentSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const IntentSelect = ({ value, onChange }: IntentSelectProps) => {
  const { intentOptions } = useCSVStore();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select intent" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        <SelectItem value="">
          <span className="text-gray-500 italic">No intent</span>
        </SelectItem>
        {intentOptions.map((intent) => (
          <SelectItem key={intent} value={intent}>
            {intent}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
