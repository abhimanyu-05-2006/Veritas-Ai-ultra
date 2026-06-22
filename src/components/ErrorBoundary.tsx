import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // @ts-ignore
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    // @ts-ignore
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-md w-full bg-card border border-border p-8 rounded-3xl shadow-2xl text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">System Interrupted</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The Veritas Engine encountered an unexpected runtime error. Your data security remains intact.
              </p>
            </div>
            {import.meta.env.DEV && (
              <div className="p-4 bg-muted/50 rounded-xl border border-border text-left overflow-auto max-h-40">
                {/* @ts-ignore */}
                <p className="text-[10px] font-mono text-rose-500 font-bold">{this.state.error?.message}</p>
                {/* @ts-ignore */}
                <p className="text-[10px] font-mono text-muted-foreground mt-2 break-all">{this.state.error?.stack}</p>
              </div>
            )}
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-widest h-12"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Reboot Engine
            </Button>
          </div>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}
