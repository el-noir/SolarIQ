export type SystemTier = 'economy' | 'premium';

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
  tier?: SystemTier;
}

export interface Installer {
  name: string;
  rating: number;
  reviews: number;
  certified: boolean;
  city: string;
  phone?: string;
  specialty?: string;
}

export type Language = 'en' | 'ur';

export interface FinancingOption {
  bankName: string;
  markupRate: number; // Annual %
  tenureYears: number;
  downPaymentPercent: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  data?: SolarData;
  timestamp: number;
}
