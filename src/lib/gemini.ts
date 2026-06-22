import { AnalysisResult } from "../types";

export async function analyzeNews(text: string): Promise<AnalysisResult> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze content');
    }

    return await response.json();
  } catch (error) {
    console.error("Error analyzing news:", error);
    throw error instanceof Error ? error : new Error("Failed to analyze the news. Please try again.");
  }
}
