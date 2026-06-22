import * as React from 'react';
import { useState, useEffect } from 'react';
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/components/LandingPage';
import { Dashboard } from '@/components/Dashboard';
import { HistoryItem } from '@/types';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('veritas_history_v3');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const updateHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('veritas_history_v3', JSON.stringify(newHistory));
  };

  if (!isMounted) return null;

  return (
    /* @ts-ignore - React 19 types */
    <ThemeProvider 
      attribute="class" 
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <ErrorBoundary>
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-emerald-500/30 transition-colors duration-300">
          <Toaster position="top-center" richColors />
          
          {/* Dynamic Background */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] dark:opacity-100 opacity-20" />
          </div>

          <Navbar currentView={view} onNavigate={setView} />
          
          <main className="relative z-10 pt-16">
            {view === 'landing' ? (
              <LandingPage onStart={() => {
                setView('dashboard');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }} />
            ) : (
              <Dashboard 
                onBack={() => setView('landing')}
                history={history} 
                onHistoryUpdate={updateHistory} 
              />
            )}
          </main>
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

