
import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Download, Upload, Settings, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CSVRow, CSVData } from '@/types/csv';
import { TableRow } from './TableRow';
import { ContextMenu } from './ContextMenu';
import { ImportDialog } from './ImportDialog';
import { ExportDialog } from './ExportDialog';
import { SettingsDialog } from './SettingsDialog';
import { useCSVStore } from '@/store/csvStore';
import { toast } from '@/hooks/use-toast';

const CSVTable = () => {
  const { 
    data, 
    addRow, 
    deleteRow, 
    updateRow, 
    importData, 
    exportData,
    theme,
    toggleTheme 
  } = useCSVStore();
  
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    rowIndex: number;
  }>({ visible: false, x: 0, y: 0, rowIndex: -1 });
  
  const [showImport, setShowImport] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Handle right-click context menu
  const handleContextMenu = useCallback((e: React.MouseEvent, rowIndex: number) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      rowIndex
    });
  }, []);

  // Hide context menu
  const hideContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

  // Handle delete row
  const handleDeleteRow = useCallback((rowIndex: number) => {
    deleteRow(rowIndex);
    hideContextMenu();
    toast({
      title: "Row deleted",
      description: "The row has been successfully removed.",
    });
  }, [deleteRow, hideContextMenu]);

  // Add new row
  const handleAddRow = useCallback(() => {
    const newRow: CSVRow = {
      id: Math.max(0, ...data.map(r => r.id)) + 1,
      question: '',
      answer: '',
      intent: 'Information'
    };
    addRow(newRow);
  }, [data, addRow]);

  // Update row data
  const handleUpdateRow = useCallback((index: number, field: keyof CSVRow, value: string | number) => {
    updateRow(index, field, value);
  }, [updateRow]);

  // Click outside to hide context menu
  useEffect(() => {
    const handleClickOutside = () => hideContextMenu();
    if (contextMenu.visible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu.visible, hideContextMenu]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'dark bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              CSV Table Editor
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your question-answer data with AI assistance
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImport(true)}
              className="gap-2 dark:text-white"
            >
              <Upload className="w-4 h-4" />
              Import CSV
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExport(true)}
              className="gap-2 dark:text-white"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="gap-2 dark:text-white"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="gap-2 dark:text-white"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </Button>
          </div>
        </div>

        {/* Table Container */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="min-w-[250px] px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="min-w-[300px] px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Answer
                  </th>
                  <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Intent
                  </th>
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
                {data.map((row, index) => (
                  <TableRow
                    key={row.id}
                    row={row}
                    index={index}
                    onUpdate={handleUpdateRow}
                    onContextMenu={handleContextMenu}
                  />
                ))}
                
                {/* Add Row Button */}
                <tr className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <td colSpan={4} className="px-4 py-8">
                    <Button
                      variant="ghost"
                      onClick={handleAddRow}
                      className="w-full h-12 border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add new row
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Context Menu */}
        {contextMenu.visible && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onDelete={() => handleDeleteRow(contextMenu.rowIndex)}
            onClose={hideContextMenu}
          />
        )}

        {/* Dialogs */}
        <ImportDialog
          open={showImport}
          onOpenChange={setShowImport}
          onImport={importData}
        />
        
        <ExportDialog
          open={showExport}
          onOpenChange={setShowExport}
          data={data}
          onExport={exportData}
        />
        
        <SettingsDialog
          open={showSettings}
          onOpenChange={setShowSettings}
        />
      </div>
    </div>
  );
};

export default CSVTable;
