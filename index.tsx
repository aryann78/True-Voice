import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// 1. Error Boundary Component
// This catches React lifecycle errors (rendering crashes)
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  // Explicitly defining props to avoid TypeScript error
  public readonly props: Readonly<ErrorBoundaryProps>;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#f9f7f2', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontFamily: 'serif', fontSize: '2rem', color: '#b68a73', marginBottom: '1rem' }}>Something went wrong.</h1>
          <p style={{ color: '#6d5d51', maxWidth: '400px', marginBottom: '2rem' }}>
            The application encountered a critical error on this device.
          </p>
          <div style={{ padding: '15px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#2d1b10', maxWidth: '90%', overflow: 'auto' }}>
             {this.state.error?.message}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '30px', padding: '12px 24px', background: '#2d1b10', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer' }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// 2. StrictMode + ErrorBoundary
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);