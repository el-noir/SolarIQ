export interface SolarData {
  systemSize: number;
  estimatedCost: number;
  paybackYears: number;
  monthlySavings: number;
  monthlyUnits: number; // Added for ROI calculations
  panelsRecommended: string;
  inverterRecommended: string;
  city: string;
  systemType: 'on-grid' | 'hybrid' | 'off-grid';
  unitRate?: number; // Optional custom unit rate
}

export type Language = 'en' | 'ur';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  data?: SolarData;
  timestamp: number;
}
