import { useState } from 'react';
import NavBar from './components/NavBar';
import Practical1View from './components/practical1/Practical1View';
import { PRACTICAL_REGISTRY, INITIAL_STUDENT_DATA } from './data/practicalsData';
import './index.css';

export default function App() {
  const [currentPractical, setCurrentPractical] = useState(1);
  const [activeSection, setActiveSection] = useState('about');
  const [themeColor, setThemeColor] = useState('#6366f1');
  const [studentData] = useState(INITIAL_STUDENT_DATA);

  // Smooth scroll handler for in-page navigation
  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="app-shell">
      {/* Top Navigation Bar with active highlight & Practical switcher */}
      <NavBar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        practicalList={PRACTICAL_REGISTRY}
        currentPractical={currentPractical}
        onSelectPractical={setCurrentPractical}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {currentPractical === 1 && (
          <Practical1View
            studentData={studentData}
            themeColor={themeColor}
            onColorChange={setThemeColor}
          />
        )}

        {currentPractical > 1 && (
          <div className="portfolio-section card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2>Practical {currentPractical}</h2>
            <p className="section-subtitle" style={{ marginTop: '0.5rem' }}>
              {PRACTICAL_REGISTRY.find((p) => p.id === currentPractical)?.title}
            </p>
            <div style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>
              Ready for upcoming practical integration. The unified workspace architecture is established.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
