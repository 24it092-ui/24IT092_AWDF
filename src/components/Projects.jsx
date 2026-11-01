export default function Projects({ projectList = [] }) {
  return (
    <section id="projects" className="portfolio-section card">
      <div className="section-header">
        <div className="section-icon">🚀</div>
        <div>
          <h2>Featured Projects</h2>
          <p className="section-subtitle">Practical post-lab assignment projects</p>
        </div>
      </div>
      <div className="projects-grid">
        {projectList.map((proj) => (
          <div key={proj.id} className="project-card">
            <div className="project-card-header">
              <span className="project-tag">{proj.tag}</span>
              <span className="project-stars">★ {proj.stars}</span>
            </div>
            <h3 className="project-title">{proj.title}</h3>
            <p className="project-desc">{proj.description}</p>
            <div className="project-tech">
              {proj.technologies.map((tech) => (
                <span key={tech} className="tech-badge">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
