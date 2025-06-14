
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IntentSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const INTENT_OPTIONS = [
  'Greeting',
  'Information',
  'Action',
  'Question',
  'Complaint',
  'Support'
];

export const IntentSelect = ({ value, onChange }: IntentSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select intent" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        {INTENT_OPTIONS.map((intent) => (
          <SelectItem key={intent} value={intent}>
            {intent}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
