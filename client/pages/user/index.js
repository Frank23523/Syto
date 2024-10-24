import { useContext, useEffect, useState } from 'react';
import { Context } from '../../context';
import UserRoute from '../../components/routes/UserRoute';
import axios from 'axios';
import { Avatar, Card, Empty } from 'antd';
import Link from 'next/link';
import { SyncOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Meta } = Card;

const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/user-courses');
      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <UserRoute>
      <div className="dashboard-container">
        {loading ? (
          <div className="d-flex justify-content-center p-5">
            <SyncOutlined spin className="display-3 text-primary" />
          </div>
        ) : (
          <>
            <h1 className="jumbotron text-center square">My Courses</h1>

            {courses && courses.length > 0 ? (
              <div className="course-list-container">
                {courses.map((course) => (
                  <Card
                    key={course._id}
                    hoverable
                    className="course-card mb-4"
                    cover={
                      <Link href={`/user/course/${course.slug}`}>
                        <a>
                          <img
                            src={
                              course.image
                                ? course.image.Location
                                : '/course.png'
                            }
                            alt={course.name}
                            style={{ height: '180px', objectFit: 'cover' }}
                            className="course-image"
                          />
                        </a>
                      </Link>
                    }
                  >
                    <Meta
                      avatar={
                        <Avatar
                          size={50}
                          src={course.instructor.avatar || '/instructor.png'}
                        />
                      }
                      title={
                        <Link href={`/user/course/${course.slug}`}>
                          <a className="course-title">{course.name}</a>
                        </Link>
                      }
                      description={
                        <>
                          <p className="text-muted">
                            {course.lessons.length} Lessons
                          </p>
                          <p className="text-muted small">
                            By {course.instructor.name}
                          </p>
                        </>
                      }
                    />
                    <Link href={`/user/course/${course.slug}`}>
                      <a className="play-icon">
                        <PlayCircleOutlined className="h2 text-primary" />
                      </a>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="empty-courses">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No courses found"
                />
              </div>
            )}
          </>
        )}
      </div>
    </UserRoute>
  );
};

export default UserIndex;
