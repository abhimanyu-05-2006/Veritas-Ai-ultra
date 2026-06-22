import * as React from 'react';
import { ShieldCheck, Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onNavigate: (view: 'landing' | 'dashboard') => void;
  currentView: 'landing' | 'dashboard';
}

export function Navbar({ onNavigate, currentView }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/60 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => onNavigate('landing')}
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5 text-black" aria-hidden="true" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            VERITAS <span className="text-emerald-500">AI</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button 
            onClick={() => onNavigate('landing')}
            className={cn(
              "transition-colors hover:text-emerald-500",
              currentView === 'landing' ? "text-emerald-500" : "text-muted-foreground"
            )}
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate('dashboard')}
            className={cn(
              "transition-colors hover:text-emerald-500",
              currentView === 'dashboard' ? "text-emerald-500" : "text-muted-foreground"
            )}
          >
            Dashboard
          </button>
          <a href="#features" className="text-muted-foreground transition-colors hover:text-emerald-500">Features</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
            aria-label={`Switch to ${mounted && theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          
          <Separator orientation="vertical" className="h-6" />

          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Sign In
          </Button>
          <Button 
            size="sm" 
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
            onClick={() => onNavigate('dashboard')}
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="text-muted-foreground"
            aria-label={`Switch to ${mounted && theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <button 
            className="text-muted-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 p-4 bg-background border-b border-border md:hidden shadow-xl"
          >
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => { onNavigate('landing'); setIsMobileMenuOpen(false); }}
                className={cn(
                  "text-left py-2 px-4 rounded-lg",
                  currentView === 'landing' ? "bg-emerald-500/10 text-emerald-500" : "text-muted-foreground"
                )}
              >
                Home
              </button>
              <button 
                onClick={() => { onNavigate('dashboard'); setIsMobileMenuOpen(false); }}
                className={cn(
                  "text-left py-2 px-4 rounded-lg",
                  currentView === 'dashboard' ? "bg-emerald-500/10 text-emerald-500" : "text-muted-foreground"
                )}
              >
                Dashboard
              </button>
              <div className="pt-4 border-t border-border mt-2 space-y-3">
                <Button variant="outline" className="w-full">Sign In</Button>
                <Button 
                  className="w-full bg-emerald-500 text-black font-bold"
                  onClick={() => { onNavigate('dashboard'); setIsMobileMenuOpen(false); }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Separator({ orientation = 'horizontal', className }: { orientation?: 'horizontal' | 'vertical', className?: string }) {
  return (
    <div className={cn(
      "bg-border shrink-0",
      orientation === 'horizontal' ? "h-[1px] w-full" : "w-[1px] h-full",
      className
    )} />
  );
}
