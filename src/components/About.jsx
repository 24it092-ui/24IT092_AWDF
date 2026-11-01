export default function About({ bio, department, semester, college }) {
  return (
    <section id="about" className="portfolio-section card">
      <div className="section-header">
        <div className="section-icon">👨‍💻</div>
        <div>
          <h2>About Me</h2>
          <p className="section-subtitle">Academic profile and technical focus</p>
        </div>
      </div>
      <div className="about-content">
        <p className="bio-text">{bio}</p>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Program:</span>
            <span className="info-val">{department}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Semester:</span>
            <span className="info-val">{semester}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Institution:</span>
            <span className="info-val">{college}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Course:</span>
            <span className="info-val">AWDF (ITUE301)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
