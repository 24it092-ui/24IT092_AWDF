import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Projects from './components/Projects';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import { INITIAL_STUDENT_DATA } from './data/practicalsData';
import './index.css';

export default function App() {
  const [studentData] = useState(INITIAL_STUDENT_DATA);
  // useState: Dark / Light Mode Toggle
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
        <Routes>
          <Route path="/" element={<Home studentData={studentData} />} />
          <Route path="/projects" element={<Projects projectList={studentData.projects} />} />
          <Route path="/contact" element={<Contact studentEmail={studentData.email} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer
        studentName={studentData.name}
        githubUrl={studentData.githubUrl}
        email={studentData.email}
      />
    </div>
  );
}
