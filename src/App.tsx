import React, { Component, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Toaster } from 'sonner';
import { FirebaseProvider } from './components/FirebaseProvider';

// Lazy load pages
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import Fees from './pages/Fees';
import Shop from './pages/Shop';
import Documents from './pages/Documents';
import News from './pages/News';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    // @ts-ignore
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-slate-600 mb-6">
              {/* @ts-ignore */}
              {this.state.error?.message?.startsWith('{') 
                ? "A database error occurred. Please try again later." 
                : "An unexpected error occurred."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    // @ts-ignore
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/fees" element={<Fees />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/news" element={<News />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/*" element={<Admin />} />
            </Routes>
          </Layout>
          <Toaster position="top-center" />
        </Router>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
