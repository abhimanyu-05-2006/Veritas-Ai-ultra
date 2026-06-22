import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  ExternalLink, 
  RefreshCw,
  Clock,
  History as HistoryIcon,
  Trash2,
  ChevronLeft,
  ShieldCheck,
  Flame,
  FileText,
  MousePointerClick,
  Link as LinkIcon,
  HelpCircle,
  BarChart3,
  Share2,
  Download,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { analyzeNews } from '@/lib/gemini';
import { AnalysisResult, HistoryItem } from '@/types';
import { cn } from '@/lib/utils';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardProps {
  onBack: () => void;
  history: HistoryItem[];
  onHistoryUpdate: (history: HistoryItem[]) => void;
}

export function Dashboard({ onBack, history, onHistoryUpdate }: DashboardProps) {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim() || input.length < 10) {
      toast.error("Input too short", { description: "Please provide at least 10 characters for a meaningful analysis." });
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeNews(input);
      setResult(data);
      
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        inputText: input,
        result: data
      };
      onHistoryUpdate([newItem, ...history].slice(0, 50));
      toast.success("Analysis Complete", {
        description: `Status: ${data.prediction} (${data.confidence}% Confidence)`
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      toast.error("Analysis Failed", { description: "The Veritas engine encountered a processing error." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearInput = () => {
    setInput('');
    setResult(null);
    setError(null);
  };

  const getVerdictLabel = (verdict: string) => {
    switch (verdict) {
      case 'True':
      case 'Authentic': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <CheckCircle2 className="w-4 h-4" /> };
      case 'Mostly True':
      case 'Misleading': return { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: <AlertTriangle className="w-4 h-4" /> };
      case 'False': return { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: <XCircle className="w-4 h-4" /> };
      case 'Mostly False': return { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: <AlertTriangle className="w-4 h-4" /> };
      case 'Mixed': return { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: <AlertTriangle className="w-4 h-4" /> };
      default: return { color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border', icon: <HelpCircle className="w-4 h-4" /> };
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'text-rose-600 bg-rose-600/10 border-rose-600/20';
      case 'High': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Moderate': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  const getCredibilityColor = (rating: string) => {
    switch (rating) {
      case 'High': return 'text-emerald-500';
      case 'Medium': return 'text-amber-500';
      case 'Low': return 'text-rose-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="pt-20 md:pt-24 pb-12 px-4 max-w-7xl mx-auto space-y-8">
      {/* Header with quick stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors group/back active:scale-95"
            onClick={onBack}
            aria-label="Return to landing page"
          >
            <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover/back:-translate-x-1" aria-hidden="true" />
            Back to Home
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-6 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">PRO</span>
              </div>
              <Badge variant="ghost" className="text-muted-foreground font-mono text-[10px] tracking-widest hidden sm:inline-flex">VERITAS v2.4.9</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Truth Dashboard</h1>
            <p className="text-muted-foreground max-w-lg text-sm sm:text-base">Advanced neural content analysis for professional fact-checking and verification.</p>
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-4 font-bold">
           <Button variant="outline" size="sm" className="flex-1 sm:flex-none justify-center bg-background/50 backdrop-blur-sm border-border active:scale-95" aria-label="Export verification report">
             <Download className="w-4 h-4 mr-2" />
             Export
           </Button>
           <Button variant="outline" size="sm" className="flex-1 sm:flex-none justify-center bg-background/50 backdrop-blur-sm border-border active:scale-95" aria-label="Share verification results">
             <Share2 className="w-4 h-4 mr-2" />
             Share
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input & Results */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Analysis Input Case */}
          <Card className="bg-card/40 border-border backdrop-blur-md overflow-hidden shadow-2xl">
            <CardHeader className="pb-3 flex flex-row items-center justify-between bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-background border border-border">
                  <FileText className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-foreground">Content Engine</CardTitle>
                  <CardDescription className="text-muted-foreground/60 text-xs font-medium">Inject raw source material for verification</CardDescription>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 transition-colors"
                onClick={clearInput}
                aria-label="Clear all input text"
              >
                <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                Flush Input
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="relative group">
                <Textarea 
                  placeholder="Paste news articles, social media threads, or official reports here for deep neural analysis..."
                  className="min-h-[200px] bg-background/50 border-border focus:border-emerald-500/50 text-foreground placeholder:text-muted-foreground/20 resize-none transition-all p-4 rounded-xl leading-relaxed text-base"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className="absolute top-4 right-4 animate-pulse pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-4 text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">
                   <div className="flex items-center gap-1.5">
                     <Clock className="w-3.5 h-3.5" /> {input.length} CHARS
                   </div>
                   <div className="w-1 h-1 rounded-full bg-border" />
                   <div className="flex items-center gap-1.5">
                     <AlertCircle className="w-3.5 h-3.5" /> EST. 2.4s DELAY
                   </div>
                 </div>
                 <Button 
                   onClick={handleAnalyze} 
                   disabled={isAnalyzing || input.length < 10}
                   className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-widest h-12 px-10 shadow-[0_10px_30px_rgba(16,185,129,0.2)] disabled:opacity-50 group active:scale-95"
                 >
                   {isAnalyzing ? (
                     <>
                       <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                       Neural Processing...
                     </>
                   ) : (
                     <>
                       <Search className="w-4 h-4 mr-3 transition-transform group-hover:scale-125" />
                       Verify Integrity
                     </>
                   )}
                 </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results Display */}
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full bg-card/50 rounded-2xl border border-border" />)}
                </div>
                <Skeleton className="h-[400px] w-full bg-card/50 rounded-2xl border border-border" />
              </motion.div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Score Summary Hierarchy */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Confidence Gauge */}
                  <Card className="md:col-span-4 bg-card border-border flex flex-col justify-center items-center p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-20 transition-opacity group-hover:opacity-100">
                      <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Label className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em] mb-4">Confidence Score</Label>
                    <div className="h-40 w-40 relative flex items-center justify-center">
                       <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                         <PieChart>
                           <Pie
                             data={[
                               { value: result.confidence ?? result.credibilityScore ?? 0 },
                               { value: 100 - (result.confidence ?? result.credibilityScore ?? 0) }
                             ]}
                             cx="50%"
                             cy="50%"
                             innerRadius={50}
                             outerRadius={70}
                             startAngle={225}
                             endAngle={-45}
                             paddingAngle={0}
                             dataKey="value"
                             isAnimationActive={true}
                           >
                             <Cell fill={(result.confidence ?? result.credibilityScore ?? 0) > 70 ? "#10b981" : (result.confidence ?? result.credibilityScore ?? 0) > 40 ? "#f59e0b" : "#ef4444"} />
                             <Cell fill="rgba(120,120,120,0.1)" />
                           </Pie>
                         </PieChart>
                       </ResponsiveContainer>
                       <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                         <span className="text-4xl font-black text-foreground">{result.confidence ?? result.credibilityScore ?? 0}%</span>
                       </div>
                    </div>
                  </Card>

                  {/* Prediction & Risk Metric */}
                  <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card className="bg-card border-border p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20" />
                      <Label className="text-muted-foreground text-[10px] font-black tracking-[0.2em] mb-2 uppercase">Prediction</Label>
                      <div className="flex-1 flex items-center mb-4">
                         <div className={cn(
                           "px-6 py-3 rounded-2xl border text-xl font-black uppercase tracking-widest bg-muted/30 w-full text-center shadow-inner",
                           getVerdictLabel(result.prediction ?? result.verdict).color,
                           getVerdictLabel(result.prediction ?? result.verdict).border
                         )}>
                           {result.prediction ?? result.verdict}
                         </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-[9px] text-muted-foreground uppercase font-black">Credibility</Label>
                          <p className={cn("text-xs font-black uppercase", getCredibilityColor(result.credibilityRating ?? 'Medium'))}>{result.credibilityRating ?? 'Medium'}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <Label className="text-[9px] text-muted-foreground uppercase font-black">Risk Level</Label>
                          <Badge className={cn("text-[9px] font-black uppercase", getRiskColor(result.riskLevel ?? 'Low'))}>{result.riskLevel ?? 'Low'}</Badge>
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-card border-border p-6 shadow-sm flex flex-col">
                       <div className="flex items-center justify-between mb-4">
                         <Label className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase">Fact Check Summary</Label>
                         <ShieldCheck className="w-4 h-4 text-emerald-500/30" aria-hidden="true" />
                       </div>
                       <div className="flex-1 flex flex-col justify-center">
                         <p className="text-sm font-bold text-foreground leading-relaxed italic border-l-2 border-emerald-500/20 pl-4 py-1">
                           {(result.factCheckSummary || result.summary || 'Summary unavailable').slice(0, 150)}...
                         </p>
                       </div>
                    </Card>
                  </div>
                </div>

                {/* AI Reasoning Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                    <Card className="bg-card/30 border-border p-6 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50" />
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <Flame className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Assessment Logic</h3>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Key neural reasoning points</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(result.reasoningBullets || []).map((bullet, i) => (
                          <div key={i} className="flex items-start gap-4 bg-muted/40 p-4 rounded-2xl border border-border/50 hover:bg-muted/60 transition-all hover:translate-y-[-2px] group/item">
                            <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0 group-hover/item:scale-125 transition-transform shadow-[0_0_10px_rgba(16,185,129,0.4)]" aria-hidden="true" />
                            <span className="text-sm font-bold text-foreground/80 leading-snug">{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                </motion.div>

                {/* Main Insight Tabs (Redesigned) */}
                <Tabs defaultValue="explanation" className="w-full">
                  <TabsList className="bg-muted/50 p-1.5 border border-border rounded-2xl w-full justify-start overflow-x-auto h-auto">
                    <TabsTrigger value="explanation" className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-emerald-500 shadow-sm transition-all h-10">Summary</TabsTrigger>
                    <TabsTrigger value="claims" className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-emerald-500 shadow-sm transition-all h-10">Key Claims</TabsTrigger>
                    <TabsTrigger value="source" className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-emerald-500 shadow-sm transition-all h-10">Source IQ</TabsTrigger>
                    <TabsTrigger value="comparison" className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-emerald-500 shadow-sm transition-all h-10">Source Comparison</TabsTrigger>
                    <TabsTrigger value="facts" className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-emerald-500 shadow-sm transition-all h-10">Checklist</TabsTrigger>
                  </TabsList>

                  <TabsContent value="explanation" className="mt-6">
                    <Card className="bg-card/40 border-border p-4 sm:p-8 shadow-sm backdrop-blur-sm">
                       <div className="flex items-center gap-3 mb-6">
                         <div className="h-8 w-1 bg-emerald-500 rounded-full" />
                         <h3 className="text-xl font-black text-foreground tracking-tight">AI Content Intelligence</h3>
                       </div>
                       <div className="space-y-6">
                         <div className="bg-muted/30 border border-border p-4 sm:p-6 rounded-2xl relative">
                            <Info className="absolute top-4 right-4 w-5 h-5 text-emerald-500/20" />
                            <p className="text-foreground leading-relaxed text-sm sm:text-base font-medium">
                              {result.summary}
                            </p>
                         </div>
                         <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap translate-x-1 px-1">
                           {result.explanation}
                         </div>
                       </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="claims" className="mt-6">
                    <div className="grid grid-cols-1 gap-4">
                      {result.keyClaims.map((claim, idx) => (
                        <Card key={idx} className="bg-card/40 border-border p-4 sm:p-6 shadow-sm hover:translate-x-1 transition-transform group">
                          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                            <div className={cn(
                              "p-3 rounded-2xl border transition-all sm:group-hover:scale-110",
                              claim.isAccurate ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            )}>
                              {claim.isAccurate ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 space-y-3 w-full">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                                <h4 className="text-foreground font-bold text-base sm:text-lg leading-tight">{claim.claim}</h4>
                                <Badge variant="outline" className={cn(
                                  "font-bold uppercase text-[10px] tracking-widest px-3 py-1 self-start sm:self-center",
                                  claim.isAccurate ? "border-emerald-500/30 text-emerald-500" : "border-rose-500/30 text-rose-500"
                                )}>
                                  {claim.isAccurate ? "Verified" : "Disputed"}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground text-sm leading-relaxed">{claim.explanation}</p>
                              {claim.correctedClaim && (
                                <div className="p-3 sm:p-4 bg-emerald-500/5 text-emerald-500 text-sm font-medium rounded-xl border border-emerald-500/10 flex items-start gap-3">
                                  <Flame className="w-4 h-4 mt-0.5 shrink-0" />
                                  <p><span className="font-black mr-2 uppercase text-[10px] tracking-widest opacity-60">Factual Correction:</span> {claim.correctedClaim}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="source" className="mt-6 space-y-6">
                    <Card className="bg-card/40 border-border p-4 sm:p-8 shadow-sm">
                      <div className="flex items-center gap-3 mb-8">
                         <div className="h-8 w-1 bg-blue-500 rounded-full" />
                         <h3 className="text-xl font-black text-foreground tracking-tight">Source Authority Profile</h3>
                       </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                        <div className="space-y-2 bg-muted/20 p-4 sm:p-5 rounded-2xl border border-border">
                          <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Digital Origin</Label>
                          <p className="text-base sm:text-lg font-bold text-foreground">{result.sourceAnalysis.origin}</p>
                        </div>
                        <div className="space-y-2 bg-muted/20 p-4 sm:p-5 rounded-2xl border border-border">
                          <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Inherent Bias</Label>
                          <div>
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 px-3 py-1 font-bold">
                              {result.sourceAnalysis.bias || 'Undetermined'}
                            </Badge>
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-3">
                          <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest px-1">Deep Credibility Audit</Label>
                          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed bg-muted/10 p-4 sm:p-6 rounded-2xl italic border border-border/50">
                            "{result.sourceAnalysis.credibilityNotes}"
                          </p>
                        </div>
                      </div>
                    </Card>
                    {result.sources.length > 0 && (
                      <div className="space-y-4">
                        <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest px-2">Verification Registry</Label>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {result.sources.map((s, i) => (
                            <Button key={i} variant="outline" size="sm" className="bg-card border-border hover:bg-muted text-foreground h-9 sm:h-10 px-3 sm:px-4 rounded-xl shadow-sm transition-all text-xs active:scale-95">
                              {s} <ExternalLink className="w-3.5 h-3.5 ml-2 opacity-40" />
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="comparison" className="mt-6">
                    <Card className="bg-card/40 border-border p-4 sm:p-8 shadow-sm">
                      <div className="flex items-center gap-3 mb-6 sm:mb-8">
                        <div className="h-8 w-1 bg-violet-500 rounded-full" />
                        <h3 className="text-xl font-black text-foreground tracking-tight">Evidence Comparison</h3>
                      </div>
                      <div className="space-y-6">
                        {result.comparisons.map((comp, i) => (
                          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                              <div className={cn(
                                 "p-2 rounded-full border shadow-xl bg-background",
                                 comp.status === 'Matches' ? "text-emerald-500 border-emerald-500/20" : 
                                 comp.status === 'Contradicts' ? "text-rose-500 border-rose-500/20" : 
                                 "text-amber-500 border-amber-500/20"
                              )}>
                                {comp.status === 'Matches' ? <CheckCircle2 className="w-4 h-4" /> : 
                                 comp.status === 'Contradicts' ? <XCircle className="w-4 h-4" /> : 
                                 <AlertCircle className="w-4 h-4" />}
                              </div>
                            </div>
                            
                            <div className="bg-muted/30 border border-border p-4 sm:p-5 rounded-2xl space-y-3">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Submitted Content</Label>
                              <p className="text-sm font-medium leading-relaxed italic text-foreground/80">"{comp.submittedText}"</p>
                            </div>
                            
                            <div className={cn(
                              "border p-4 sm:p-5 rounded-2xl space-y-3 relative overflow-hidden",
                              comp.status === 'Matches' ? "bg-emerald-500/5 border-emerald-500/20" : 
                              comp.status === 'Contradicts' ? "bg-rose-500/5 border-rose-500/20" : 
                              "bg-amber-500/5 border-amber-500/20"
                            )}>
                              <div className="flex items-center justify-between">
                                 <Label className={cn(
                                   "text-[10px] font-black uppercase tracking-widest",
                                   comp.status === 'Matches' ? "text-emerald-500" : 
                                   comp.status === 'Contradicts' ? "text-rose-500" : 
                                   "text-amber-500"
                                 )}>{comp.sourceName}</Label>
                                 <Badge variant="outline" className={cn(
                                   "text-[9px] font-black uppercase tracking-tighter",
                                   comp.status === 'Matches' ? "border-emerald-500/30 text-emerald-500" : 
                                   comp.status === 'Contradicts' ? "border-rose-500/30 text-rose-500" : 
                                   "border-amber-500/30 text-amber-500"
                                 )}>{comp.status}</Badge>
                              </div>
                              <p className="text-sm font-semibold leading-relaxed text-foreground">"{comp.sourceText}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="facts" className="mt-6">
                    <Card className="bg-card/40 border-border p-4 sm:p-8 shadow-sm">
                       <div className="flex items-center gap-3 mb-6 sm:mb-8">
                         <div className="h-8 w-1 bg-emerald-500 rounded-full" />
                         <h3 className="text-xl font-black text-foreground tracking-tight">Essential Truth Extraction</h3>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                         {result.factCheckBullets.map((f, i) => (
                           <div key={i} className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border hover:bg-muted/40 transition-colors">
                             <div className="mt-1.5 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] shrink-0" />
                             <span className="text-sm text-foreground font-medium leading-relaxed">{f}</span>
                           </div>
                         ))}
                       </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Right Column: History & Stats */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Network Integrity Stats */}
          <Card className="bg-card/40 border-border backdrop-blur-md shadow-xl overflow-hidden group">
            <CardHeader className="pb-2 bg-muted/30">
              <CardTitle className="text-xs font-black text-foreground uppercase tracking-widest flex items-center justify-between">
                <span>Integrity Pulse</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-500 font-bold">LIVE</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[140px] w-full transform group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={[
                    { val: 40 }, { val: 45 }, { val: 42 }, { val: 56 }, { val: 52 }, { val: 68 }, { val: 72 }
                  ]}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-muted/40 rounded-2xl border border-border text-center shadow-inner">
                  <div className="text-muted-foreground text-[10px] uppercase font-black tracking-widest mb-1 opacity-60">Verified</div>
                  <div className="text-foreground font-black text-xl sm:text-2xl">14.2K</div>
                </div>
                <div className="p-3 sm:p-4 bg-muted/40 rounded-2xl border border-border text-center shadow-inner">
                  <div className="text-muted-foreground text-[10px] uppercase font-black tracking-widest mb-1 opacity-60">Blocked</div>
                  <div className="text-emerald-500 font-black text-xl sm:text-2xl">892</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Log (Sleek) */}
          <Card className="bg-card/40 border-border backdrop-blur-md flex flex-col h-[450px] sm:h-[550px] shadow-xl overflow-hidden">
             <CardHeader className="pb-4 border-b border-border bg-muted/30">
               <div className="flex items-center justify-between">
                 <CardTitle className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                   <HistoryIcon className="w-4 h-4 text-muted-foreground/60" aria-hidden="true" />
                   Verification Log
                 </CardTitle>
                 {history.length > 0 && (
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-rose-500 active:scale-95 transition-colors" 
                    onClick={() => onHistoryUpdate([])}
                    aria-label="Clear verification history"
                   >
                     <Trash2 className="w-4 h-4" aria-hidden="true" />
                   </Button>
                 )}
               </div>
             </CardHeader>
             <ScrollArea className="flex-1 p-0">
               {history.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full p-8 sm:p-12 text-center">
                   <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center mb-6">
                     <Clock className="w-5 h-5 text-muted-foreground/20" />
                   </div>
                   <p className="text-muted-foreground/40 text-[10px] font-black uppercase tracking-[0.2em] px-4">Void Log. No scans detected.</p>
                 </div>
               ) : (
                 <div className="divide-y divide-border">
                   {history.map((item) => {
                     const label = getVerdictLabel(item.result.prediction || item.result.verdict);
                     return (
                       <div 
                         key={item.id} 
                         className="p-4 sm:p-5 hover:bg-muted/30 cursor-pointer transition-all group relative overflow-hidden"
                         onClick={() => {
                           setInput(item.inputText);
                           setResult(item.result);
                           window.scrollTo({ top: 0, behavior: 'smooth' });
                         }}
                       >
                         <div className="absolute left-0 top-0 h-full w-0.5 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                         <div className="flex items-start justify-between mb-3">
                           <Badge variant="outline" className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0", label.bg, label.color, label.border)}>
                             {item.result.prediction || item.result.verdict}
                           </Badge>
                           <span className="text-[10px] text-muted-foreground/40 font-mono font-bold">
                             {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                         </div>
                         <p className="text-sm text-foreground/80 line-clamp-1 mb-3 group-hover:text-foreground transition-colors font-medium">
                           {item.inputText}
                         </p>
                         <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                           <span className="flex items-center gap-1.5">
                             <ShieldCheck className={cn("w-3.5 h-3.5", label.color)} /> {item.result.confidence || item.result.credibilityScore}% Confidence
                           </span>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               )}
             </ScrollArea>
             {history.length > 0 && (
               <div className="p-4 bg-muted/30 border-t border-border">
                  <Button variant="outline" className="w-full text-xs font-black uppercase tracking-[0.2em] h-10 border-border text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 transition-all active:scale-95" onClick={() => onHistoryUpdate([])}>
                     Clear Log
                  </Button>
               </div>
             )}
          </Card>
        </div>
      </div>
    </div>
  );
}
