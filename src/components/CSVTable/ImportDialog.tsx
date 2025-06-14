
import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CSVRow } from '@/types/csv';
import { toast } from '@/hooks/use-toast';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: CSVRow[]) => void;
}

export const ImportDialog = ({ open, onOpenChange, onImport }: ImportDialogProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processCSV = useCallback((text: string) => {
    try {
      setIsProcessing(true);
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Validate headers
      const requiredHeaders = ['id', 'question', 'answer', 'intent'];
      const hasAllHeaders = requiredHeaders.every(header => 
        headers.some(h => h.includes(header))
      );
      
      if (!hasAllHeaders) {
        throw new Error('CSV must contain columns: ID, Question, Answer, Intent');
      }
      
      const data: CSVRow[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
        
        if (values.length >= 4) {
          data.push({
            id: parseInt(values[0]) || i,
            question: values[1] || '',
            answer: values[2] || '',
            intent: values[3] || 'Information'
          });
        }
      }
      
      onImport(data);
      onOpenChange(false);
      
      toast({
        title: "Import successful",
        description: `Imported ${data.length} rows successfully.`,
      });
      
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Invalid CSV format",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onImport, onOpenChange]);

  const handleFile = useCallback((file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file.",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      processCSV(text);
    };
    reader.readAsText(file);
  }, [processCSV]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import CSV File
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Drop your CSV file here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              or click to browse
            </p>
            
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
              id="csv-file-input"
              disabled={isProcessing}
            />
            
            <Button
              variant="outline"
              onClick={() => document.getElementById('csv-file-input')?.click()}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Choose File'}
            </Button>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                  CSV Format Requirements:
                </p>
                <ul className="text-amber-700 dark:text-amber-300 space-y-1">
                  <li>• Must include headers: ID, Question, Answer, Intent</li>
                  <li>• First row should contain column headers</li>
                  <li>• Use comma separation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
