import { useState, useEffect } from 'react';
import axios from 'axios';
import InstructorRoute from '../../components/routes/InstructorRoute';
import { Tooltip, Card, Empty } from 'antd';
import Link from 'next/link';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data } = await axios.get('/api/instructor-courses');
    setCourses(data);
  };

  return (
    <InstructorRoute>
      <div className="dashboard-container">
        <h1 className="jumbotron text-center square">Instructor Dashboard</h1>

        {courses && courses.length > 0 ? (
          <div className="course-list-container">
            {courses.map((course) => (
              <Card
                key={course._id}
                hoverable
                className="course-card mb-4"
                cover={
                  <Link href={`/instructor/course/view/${course.slug}`}>
                    <a>
                      <img
                        src={
                          course.image ? course.image.Location : '/course.png'
                        }
                        alt={course.name}
                        style={{ height: '180px', objectFit: 'cover' }}
                      />
                    </a>
                  </Link>
                }
              >
                <Card.Meta
                  title={
                    <Link href={`/instructor/course/view/${course.slug}`}>
                      <a className="course-title">{course.name}</a>
                    </Link>
                  }
                  description={
                    <>
                      <p>{course.lessons.length} Lessons</p>
                      {course.lessons.length < 5 ? (
                        <p className="text-warning small">
                          At least 5 lessons are required to publish a course
                        </p>
                      ) : course.published ? (
                        <p className="text-success small">
                          Your course is live in the marketplace
                        </p>
                      ) : (
                        <p className="text-info small">
                          Your course is ready to be published
                        </p>
                      )}
                    </>
                  }
                />
                <div className="course-status-icon">
                  <Tooltip
                    title={course.published ? 'Published' : 'Unpublished'}
                  >
                    {course.published ? (
                      <CheckCircleOutlined className="h5 pointer text-success" />
                    ) : (
                      <CloseCircleOutlined className="h5 pointer text-warning" />
                    )}
                  </Tooltip>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No Courses Yet"
          />
        )}
      </div>
    </InstructorRoute>
  );
};

export default InstructorIndex;
