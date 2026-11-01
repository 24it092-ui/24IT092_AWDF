export default function Skills({ skillList = [] }) {
  return (
    <section id="skills" className="portfolio-section card">
      <div className="section-header">
        <div className="section-icon">⚡</div>
        <div>
          <h2>Technical Skills</h2>
          <p className="section-subtitle">Rendered dynamically via props</p>
        </div>
      </div>
      <div className="skills-container">
        <ul className="skills-list">
          {skillList.map((skill, index) => (
            <li key={index} className="skill-pill">
              <span className="skill-dot"></span>
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
