import Header from './Header';
import About from './About';
import Skills from './Skills';

export default function Home({ studentData }) {
  return (
    <div className="portfolio-paper">
      <Header
        name={studentData.name}
        title={studentData.title}
        rollNo={studentData.rollNo}
      />
      <About
        bio={studentData.bio}
        department={studentData.department}
        semester={studentData.semester}
        college={studentData.college}
      />
      <Skills skillList={studentData.skills} />
    </div>
  );
}
