
import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CSVRow } from '@/types/csv';
import { toast } from '@/hooks/use-toast';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CSVRow[];
  onExport: (data: CSVRow[], options: { delimiter: string; filename: string }) => void;
}

const escapeCSVField = (field: string | number): string => {
  const str = String(field);
  
  // Replace newlines with \n
  let escaped = str.replace(/\r?\n/g, '\\n');
  
  // Replace carriage returns with \r
  escaped = escaped.replace(/\r/g, '\\r');
  
  // Replace tabs with \t
  escaped = escaped.replace(/\t/g, '\\t');
  
  // If field contains delimiter, quotes, or other special characters, wrap in quotes
  // and escape existing quotes by doubling them
  if (escaped.includes(',') || escaped.includes(';') || escaped.includes('"') || escaped.includes('\\n') || escaped.includes('\\r')) {
    escaped = escaped.replace(/"/g, '""');
    escaped = `"${escaped}"`;
  }
  
  return escaped;
};

export const ExportDialog = ({ open, onOpenChange, data, onExport }: ExportDialogProps) => {
  const [delimiter, setDelimiter] = useState(',');
  const [filename, setFilename] = useState(() => {
    const now = new Date();
    return `csv-export-${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  });

  const handleExport = () => {
    if (data.length === 0) {
      toast({
        title: "No data to export",
        description: "Add some rows to the table before exporting.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create CSV content with proper escaping
      const headers = ['ID', 'Question', 'Answer', 'Intent'];
      const csvContent = [
        headers.join(delimiter),
        ...data.map(row => [
          escapeCSVField(row.id),
          escapeCSVField(row.question),
          escapeCSVField(row.answer),
          escapeCSVField(row.intent)
        ].join(delimiter))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      onOpenChange(false);
      
      toast({
        title: "Export successful",
        description: `Exported ${data.length} rows to ${filename}.csv`,
      });
      
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export the data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export CSV File
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <input
              id="filename"
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
              placeholder="Enter filename (without .csv)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="delimiter">Delimiter</Label>
            <Select value={delimiter} onValueChange={setDelimiter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=",">Comma (,)</SelectItem>
                <SelectItem value=";">Semicolon (;)</SelectItem>
                <SelectItem value="\t">Tab</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Export Summary:
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  {data.length} rows will be exported with headers
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleExport} className="flex-1">
              Export CSV
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
