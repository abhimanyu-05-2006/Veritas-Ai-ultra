export interface ComparisonPoint {
  submittedText: string;
  sourceText: string;
  sourceName: string;
  status: 'Matches' | 'Contradicts' | 'Unverified';
}

export interface AnalysisResult {
  prediction: 'Authentic' | 'Misleading' | 'False' | 'Unverified';
  confidence: number;
  factCheckSummary: string;
  credibilityRating: 'High' | 'Medium' | 'Low';
  riskLevel: 'None' | 'Low' | 'Moderate' | 'High' | 'Critical';
  explanation: string;
  // Keep existing fields for backward compatibility or extra detail
  credibilityScore?: number;
  clickbaitScore?: number;
  verdict?: 'True' | 'Mostly True' | 'Mixed' | 'Mostly False' | 'False' | 'Unverified';
  summary?: string;
  keyClaims: ClaimAnalysis[];
  sourceAnalysis: {
    origin: string;
    bias: string;
    credibilityNotes: string;
  };
  factCheckBullets: string[];
  reasoningBullets: string[];
  comparisons: ComparisonPoint[];
  sources: string[];
}

export interface ClaimAnalysis {
  claim: string;
  isAccurate: boolean;
  explanation: string;
  correctedClaim?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  inputText: string;
  result: AnalysisResult;
}
