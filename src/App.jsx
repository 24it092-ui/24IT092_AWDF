import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { INITIAL_STUDENT_DATA } from './data/practicalsData';
import './index.css';

// Route-based code splitting using React.lazy()
const Home = lazy(() => import('./components/Home'));
const Projects = lazy(() => import('./components/Projects'));
const TasksManager = lazy(() => import('./components/TasksManager'));
const Contact = lazy(() => import('./components/Contact'));
const NotFound = lazy(() => import('./components/NotFound'));

// Supplementary: lazy-loaded heavy analytical widget
const PerformanceMetricsChart = lazy(() => import('./components/PerformanceMetricsChart'));

// Meaningful fallback UI component with minimum delay / smooth animation
function RouteLoadingFallback() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <div
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          margin: '0 auto 1rem',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading page chunk (React.lazy)...</p>
    </div>
  );
}

export default function App() {
  const [studentData] = useState(INITIAL_STUDENT_DATA);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
    }
  }, [isDarkMode]);

  return (
    <div className="app-shell">
      <NavBar isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />

      <main className="main-content">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Home studentData={studentData} />
                  <Suspense fallback={<div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-sub)' }}>Loading analytical metrics chunk...</div>}>
                    <PerformanceMetricsChart />
                  </Suspense>
                </>
              }
            />
            <Route path="/projects" element={<Projects projectList={studentData.projects} />} />
            <Route path="/tasks" element={<TasksManager />} />
            <Route path="/contact" element={<Contact studentEmail={studentData.email} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer
        studentName={studentData.name}
        githubUrl={studentData.githubUrl}
        email={studentData.email}
      />
    </div>
  );
}
