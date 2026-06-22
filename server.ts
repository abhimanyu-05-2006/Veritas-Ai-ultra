import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import helmet from 'helmet';
import { z } from 'zod';
import xss from 'xss';

dotenv.config();

const app = express();
const PORT = 3000;

// Essential for express-rate-limit to work behind cloud proxies
app.set('trust proxy', true);

// High-performance compression
app.use(compression());

// Professional Security Headers
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Professional Rate Limiting
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1000, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Veritas Engine protection: Rate limit exceeded.' },
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      return (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0]).trim();
    }
    return req.ip || 'unknown';
  },
  validate: { trustProxy: false }
});

app.use(express.json());

// Lazy-initialized Gemini client
let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

// Analysis Request Schema
const analyzeSchema = z.object({
  text: z.string().min(10, "Minimum 10 characters required").max(50000, "Maximum 50,000 characters allowed"),
});

// Analysis API Route
app.post('/api/analyze', limiter, async (req, res) => {
  try {
    const aiInstance = getAI();

    // 1. Validate Input
    const parseResult = analyzeSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues[0].message });
    }

    // 2. Sanitize Input
    const sanitizedText = xss(parseResult.data.text);

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        prediction: { type: Type.STRING, enum: ["Authentic", "Misleading", "False", "Unverified"] },
        confidence: { type: Type.NUMBER },
        factCheckSummary: { type: Type.STRING },
        credibilityRating: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
        riskLevel: { type: Type.STRING, enum: ["None", "Low", "Moderate", "High", "Critical"] },
        explanation: { type: Type.STRING },
        credibilityScore: { type: Type.NUMBER },
        clickbaitScore: { type: Type.NUMBER },
        verdict: { type: Type.STRING, enum: ["True", "Mostly True", "Mixed", "Mostly False", "False", "Unverified"] },
        summary: { type: Type.STRING },
        keyClaims: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              claim: { type: Type.STRING },
              isAccurate: { type: Type.BOOLEAN },
              explanation: { type: Type.STRING },
              correctedClaim: { type: Type.STRING },
            },
            required: ["claim", "isAccurate", "explanation"]
          }
        },
        sourceAnalysis: {
          type: Type.OBJECT,
          properties: {
            origin: { type: Type.STRING },
            bias: { type: Type.STRING },
            credibilityNotes: { type: Type.STRING }
          },
          required: ["origin", "bias", "credibilityNotes"]
        },
        factCheckBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
        reasoningBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
        comparisons: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              submittedText: { type: Type.STRING },
              sourceText: { type: Type.STRING },
              sourceName: { type: Type.STRING },
              status: { type: Type.STRING, enum: ["Matches", "Contradicts", "Unverified"] }
            },
            required: ["submittedText", "sourceText", "sourceName", "status"]
          }
        },
        sources: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["prediction", "confidence", "factCheckSummary", "credibilityRating", "riskLevel", "explanation", "credibilityScore", "clickbaitScore", "verdict", "summary", "keyClaims", "sourceAnalysis", "factCheckBullets", "reasoningBullets", "comparisons", "sources"]
    };

    let response;
    try {
      response = await aiInstance.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: sanitizedText }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          systemInstruction: `You are Veritas AI, a world-class misinformation detection and fact-checking system for a professional SaaS platform.
Analyze the provided content deeply.
Required Output:
1. Prediction: Authentic, Misleading, False, or Unverified.
2. Confidence Score: 0-100 (probability assessment).
3. Fact Check Summary: A concise professional summary of the factual status.
4. Credibility Rating: High, Medium, or Low.
5. Risk Level: None, Low, Moderate, High, or Critical.
6. Explanation: Professional reasoning for the assessment.
7. Verdict: True, Mostly True, Mixed, Mostly False, False, or Unverified.
8. Clickbait Score: 0-100.
9. Credibility Score: 0-100.
10. Key Claims: Breakdown of specific claims.
11. Source Analysis: Identify origins and biases.
12. Fact-Check Bullets: Core facts vs myths.
13. Reasoning Bullets: 3-5 concise bullets.
14. Side-by-Side Comparisons: Evidence-based comparisons.

Return results in JSON format matching the responseSchema.`,
        },
      });
    } catch (primaryError: any) {
      console.warn('Primary model (gemini-2.0-flash) failed, attempting fallback:', primaryError.message);
      
      // Fallback to gemini-1.5-flash if 2.0 is overloaded or unavailable
      if (primaryError.message?.includes('503') || primaryError.message?.includes('429')) {
        response = await aiInstance.models.generateContent({
          model: "gemini-1.5-flash",
          contents: [{ role: "user", parts: [{ text: sanitizedText }] }],
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            systemInstruction: `You are Veritas AI (Fallback Engine). Perform deep fact-checking analysis.`,
          },
        });
      } else {
        throw primaryError;
      }
    }

    const analysis = JSON.parse(response.text);
    res.json(analysis);

  } catch (error: any) {
    console.error('Analysis error:', error);
    
    // Better handling for service availability errors
    if (error.message?.includes('503') || error.message?.includes('high demand') || error.message?.includes('UNAVAILABLE')) {
      return res.status(503).json({ 
        error: 'The Veritas AI Engine is currently experiencing high demand. Please try again in a few moments.',
        details: 'Service Temporarily Unavailable (503)'
      });
    }
    
    // Better handling for quota errors
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return res.status(429).json({ 
        error: 'Engine capacity limit reached. Please wait a minute before requesting a new analysis.',
        details: 'API Quota Exceeded (429)'
      });
    }

    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
});

// Vite middleware for development
async function startServer() {
  // Enhanced Request logger
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (res.statusCode >= 400) {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
      }
    });
    next();
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa", // Switch back to 'spa' for more reliable built-in fallback handling
    });
    app.use(vite.middlewares);
    
    // The 'spa' appType handles index.html transformation automatically
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Serve static files with aggressive caching (1 year) for hashes, 0 for html
    app.use(express.static(distPath, {
      maxAge: '1y',
      index: false,
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Veritas AI SaaS Server running on http://localhost:${PORT}`);
  });

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[Global Error Manager]:', err);
    res.status(500).json({ 
      error: 'Veritas Engine encountered a runtime exception.', 
      requestId: req.headers['x-request-id'] || 'internal'
    });
  });
}

startServer();
