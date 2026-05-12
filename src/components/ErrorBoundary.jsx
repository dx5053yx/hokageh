import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Something went wrong!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>We're sorry, but the application crashed.</p>
          <div className="glass-panel" style={{ padding: '1rem', color: 'var(--accent-danger)', textAlign: 'left', maxWidth: '800px', overflowX: 'auto' }}>
            <code>{this.state.error?.toString()}</code>
          </div>
          <button 
            className="btn-primary" 
            style={{ marginTop: '2rem' }}
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
