
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CSVRow } from '@/types/csv';

interface CSVStore {
  data: CSVRow[];
  openAIKey: string;
  openAIModel: string;
  systemPrompt: string;
  maxTokens: number;
  customIntents: string[];
  theme: 'light' | 'dark';
  
  // Actions
  addRow: (row: CSVRow) => void;
  deleteRow: (index: number) => void;
  updateRow: (index: number, field: keyof CSVRow, value: string | number) => void;
  importData: (newData: CSVRow[]) => void;
  exportData: (data: CSVRow[], options: { delimiter: string; filename: string }) => void;
  setOpenAIKey: (key: string) => void;
  setOpenAIModel: (model: string) => void;
  setSystemPrompt: (prompt: string) => void;
  setMaxTokens: (tokens: number) => void;
  addCustomIntent: (intent: string) => void;
  removeCustomIntent: (intent: string) => void;
  toggleTheme: () => void;
}

export const useCSVStore = create<CSVStore>()(
  persist(
    (set, get) => ({
      data: [
        {
          id: 1,
          question: "What is your name?",
          answer: "I am an AI assistant created to help you manage your CSV data.",
          intent: ""
        },
        {
          id: 2,
          question: "How can I import CSV files?",
          answer: "You can import CSV files by clicking the Import CSV button and selecting your file.",
          intent: ""
        }
      ],
      openAIKey: '',
      openAIModel: 'gpt-3.5-turbo',
      systemPrompt: 'You are an AI assistant that helps generate questions and answers for FAQ datasets. Be clear, concise, and helpful.',
      maxTokens: 150,
      customIntents: [],
      theme: 'light',

      addRow: (row) => set((state) => ({
        data: [...state.data, row]
      })),

      deleteRow: (index) => set((state) => ({
        data: state.data.filter((_, i) => i !== index)
      })),

      updateRow: (index, field, value) => set((state) => ({
        data: state.data.map((row, i) => 
          i === index ? { ...row, [field]: value } : row
        )
      })),

      importData: (newData) => set({ data: newData }),

      exportData: (data, options) => {
        // This is handled in the component, but we keep it here for consistency
      },

      setOpenAIKey: (key) => set({ openAIKey: key }),

      setOpenAIModel: (model) => set({ openAIModel: model }),

      setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),

      setMaxTokens: (tokens) => set({ maxTokens: tokens }),

      addCustomIntent: (intent) => set((state) => ({
        customIntents: [...state.customIntents, intent]
      })),

      removeCustomIntent: (intent) => set((state) => ({
        customIntents: state.customIntents.filter(i => i !== intent)
      })),

      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
    }),
    {
      name: 'csv-table-storage',
    }
  )
);
