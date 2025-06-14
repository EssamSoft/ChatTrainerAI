
export interface CSVRow {
  id: number;
  question: string;
  answer: string;
  intent: string;
}

export interface CSVData {
  rows: CSVRow[];
}

export interface AISettings {
  apiKey: string;
  model: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  aiSettings: AISettings;
}
