import axios from 'axios';
import CourseCard from '../components/cards/CourseCard';

const Index = ({ courses }) => {
  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Syto: Connecting Kids and Tutors</h1>
          <p className="hero-subtitle">
            Where kids meet tutors, and learning goes viral!
          </p>
          <button className="primary-button">Explore Courses</button>
        </div>
        <div className="hero-graphic">
          {/* Placeholder for future graphics or illustrations */}
        </div>
      </div>
      <div className="container-fluid course-container">
        <div className="row">
          {courses.map((course) => (
            <div key={course._id} className="col-md-4 course-card">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/courses`);
  return {
    props: {
      courses: data,
    },
  };
}

export default Index;
