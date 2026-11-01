import Header from '../Header';
import About from '../About';
import Skills from '../Skills';
import Projects from '../Projects';
import Footer from '../Footer';

export default function Practical1View({ studentData, themeColor, onColorChange }) {
  const colors = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Rose', value: '#f43f5e' },
  ];

  return (
    <div className="practical1-container">
      {/* Interactive Controls Bar for Viva / Experimentation */}
      <div className="experiment-bar">
        <span className="experiment-title">🧪 Viva Experimentation Panel (Props & Re-rendering):</span>
        <div className="color-picker-group">
          <span className="picker-label">Header Theme Prop:</span>
          {colors.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`color-chip ${themeColor === c.value ? 'selected' : ''}`}
              style={{ backgroundColor: c.value }}
              title={c.name}
              onClick={() => onColorChange(c.value)}
            />
          ))}
        </div>
      </div>

      <div className="portfolio-paper">
        {/* Component 1: Header */}
        <Header
          name={studentData.name}
          title={studentData.title}
          rollNo={studentData.rollNo}
          themeColor={themeColor}
        />

        {/* Component 2: About */}
        <About
          bio={studentData.bio}
          department={studentData.department}
          semester={studentData.semester}
          college={studentData.college}
        />

        {/* Component 3: Skills (receives skillList prop) */}
        <Skills skillList={studentData.skills} />

        {/* Post-Lab Component: Projects (receives projectList prop) */}
        <Projects projectList={studentData.projects} />

        {/* Lab Analysis Section (Answers to Practical 1 questions) */}
        <section id="analysis" className="portfolio-section card">
          <div className="section-header">
            <div className="section-icon">📚</div>
            <div>
              <h2>Key Questions & Viva Analysis</h2>
              <p className="section-subtitle">Practical 1 Core Concepts Evaluation</p>
            </div>
          </div>
          <div className="qa-grid">
            <div className="qa-card">
              <h4>1. What is the role of each component in the overall UI structure?</h4>
              <p>
                Each component encapsulates a distinct concern: <code>Header</code> displays personal identity and branding, 
                <code>About</code> presents biography and educational background, <code>Skills</code> renders dynamic technical proficiencies, 
                and <code>Footer</code> handles metadata and contact coordinates. This modular hierarchy promotes single responsibility.
              </p>
            </div>
            <div className="qa-card">
              <h4>2. How does React re-render when props change?</h4>
              <p>
                When a parent component passes modified props (such as switching the theme color in the panel above), 
                React performs a shallow comparison of props, reconciles the Virtual DOM, and updates only the mutated DOM nodes efficiently without full page refreshes.
              </p>
            </div>
            <div className="qa-card">
              <h4>3. Why is component reusability important in large-scale applications?</h4>
              <p>
                Reusability eliminates duplicated logic/JSX (DRY principle), standardizes design tokens across teams, accelerates development cycles, and ensures bug fixes or visual changes propagate everywhere consistently.
              </p>
            </div>
          </div>
        </section>

        {/* Component 4: Footer */}
        <Footer
          studentName={studentData.name}
          githubUrl={studentData.githubUrl}
          email={studentData.email}
        />
      </div>
    </div>
  );
}
