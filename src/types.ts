export interface SolarData {
  systemSize: number;
  estimatedCost: number;
  paybackYears: number;
  monthlySavings: number;
  panelsRecommended: string;
  inverterRecommended: string;
  city: string;
  systemType: 'on-grid' | 'hybrid' | 'off-grid';
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  data?: SolarData;
  timestamp: number;
}
