import * as React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Search, Zap, Globe, BarChart3, Lock, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-xs font-medium mb-6">
              <Zap className="w-3 h-3" aria-hidden="true" />
              <span>Next-Gen Fact Checking Engine</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
              Detect Truth in a <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                World of Misinformation
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-muted-foreground text-base md:text-lg mb-10 leading-relaxed px-4">
              Veritas AI uses advanced neural networks and cross-referenced datasets to analyze news, reports, 
              and social media claims with clinical precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-base shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95"
                onClick={onStart}
                aria-label="Analyze Content Now: Start fact checking"
              >
                Analyze Content Now
                <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 border-white/10 text-white hover:bg-white/5 active:scale-95" aria-label="Watch Demo Video">
                <Play className="mr-2 w-4 h-4 fill-white" aria-hidden="true" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale filter">
              <div className="flex items-center gap-2 text-xl font-bold font-mono">REUTERS</div>
              <div className="flex items-center gap-2 text-xl font-bold font-mono">AP NEWS</div>
              <div className="flex items-center gap-2 text-xl font-bold font-mono">BBC</div>
              <div className="flex items-center gap-2 text-xl font-bold font-mono">NYTIMES</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">Industrial-Grade Fact Checking</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              Our multi-layered analysis engine processes content through multiple specialized detectors to ensure maximum accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <FeatureCard 
              icon={<Search className="w-6 h-6 text-emerald-400" />}
              title="Semantic Verification"
              description="Cross-references claims against massive real-time knowledge bases and trusted news archives."
            />
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-blue-400" />}
              title="Source Credibility"
              description="Evaluates the reliability, bias, and authority of the content's origin."
            />
            <FeatureCard 
              icon={<Lock className="w-6 h-6 text-purple-400" />}
              title="Anti-Clickbait"
              description="Detects sensationalism and emotional manipulation designed to drive clicks."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-amber-400" />}
              title="Instant Analysis"
              description="Get comprehensive truth scores and detailed explanations in seconds."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-pink-400" />}
              title="Metric-Driven"
              description="Quantifiable scores for credibility and factual alignment with visualizations."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
              title="API Integration"
              description="Connect Veritas AI directly into your CMS with robust enterprise end-points."
            />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-b from-card to-background border border-border rounded-3xl p-6 sm:p-10 md:p-12 text-center">
            <div className="flex justify-center mb-6">
                <div className="flex -space-x-3 sm:-space-x-4">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] sm:text-xs font-bold text-muted-foreground shadow-sm">U{i}</div>
                    ))}
                </div>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Trusted by 10,000+ Professionals</h3>
            <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-2xl mx-auto italic leading-relaxed px-2">
                "Veritas AI has become an essential part of our verification process. It catches subtle biases that human editors might miss initially."
            </p>
            <div className="font-medium text-emerald-500 text-sm sm:text-base">— Sarah Jenkins, Senior Editor at Global Times</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-500" aria-hidden="true" />
            <span className="font-bold text-lg text-foreground">VERITAS AI</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <div className="text-sm text-muted-foreground/60">
            © 2026 Veritas AI Detection. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-card/50 border-border backdrop-blur-sm hover:border-emerald-500/20 transition-all duration-300 group">
      <CardContent className="pt-8 text-left">
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
