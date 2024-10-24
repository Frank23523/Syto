import { useState, useEffect, createElement } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import StudentRoute from '../../../components/routes/StudentRoute';
import { Button, Menu, Avatar, Typography } from 'antd';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import {
  PlayCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckCircleFilled,
  MinusCircleFilled,
} from '@ant-design/icons';

const { Item } = Menu;
const { Title } = Typography;

const SingleCourse = () => {
  const [clicked, setClicked] = useState(-1);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({ lessons: [] });
  const [completedLessons, setCompletedLessons] = useState([]);
  const [updateState, setUpdateState] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) loadCourse();
  }, [slug]);

  useEffect(() => {
    if (course) loadCompletedLessons();
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/user/course/${slug}`);
    setCourse(data);
  };

  const loadCompletedLessons = async () => {
    const { data } = await axios.post(`/api/list-completed`, {
      courseId: course._id,
    });
    setCompletedLessons(data);
  };

  const markCompleted = async () => {
    const { data } = await axios.post(`/api/mark-completed`, {
      courseId: course._id,
      lessonId: course.lessons[clicked]._id,
    });
    setCompletedLessons([...completedLessons, course.lessons[clicked]._id]);
  };

  const markIncomplete = async () => {
    try {
      const { data } = await axios.post(`/api/mark-incomplete`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      const all = completedLessons;
      const index = all.indexOf(course.lessons[clicked]._id);
      if (index > -1) {
        all.splice(index, 1);
        setCompletedLessons(all);
        setUpdateState(!updateState);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <StudentRoute>
      <div className="course-page-container">
        <div className="sidebar">
          <Button
            onClick={() => setCollapsed(!collapsed)}
            className="toggle-button"
          >
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
            {!collapsed && <span className="lessons-label">Lessons</span>}
          </Button>
          <Menu
            defaultSelectedKeys={[clicked]}
            inlineCollapsed={collapsed}
            className="lessons-menu"
          >
            {course.lessons.map((lesson, index) => (
              <Item
                onClick={() => setClicked(index)}
                key={index}
                icon={<Avatar>{index + 1}</Avatar>}
                className="lesson-item"
              >
                {lesson.title.substring(0, 30)}
                {completedLessons.includes(lesson._id) ? (
                  <CheckCircleFilled className="completed-icon" />
                ) : (
                  <MinusCircleFilled className="incomplete-icon" />
                )}
              </Item>
            ))}
          </Menu>
        </div>

        <div className="content-area">
          {clicked !== -1 ? (
            <>
              <div className="lesson-header">
                <Title level={4} className="lesson-title">
                  {course.lessons[clicked].title.substring(0, 30)}
                </Title>
                {completedLessons.includes(course.lessons[clicked]._id) ? (
                  <Button
                    type="link"
                    className="mark-button"
                    onClick={markIncomplete}
                  >
                    Mark as incomplete
                  </Button>
                ) : (
                  <Button
                    type="link"
                    className="mark-button"
                    onClick={markCompleted}
                  >
                    Mark as completed
                  </Button>
                )}
              </div>

              {course.lessons[clicked].video &&
                course.lessons[clicked].video.Location && (
                  <div className="video-wrapper">
                    <ReactPlayer
                      className="video-player"
                      url={course.lessons[clicked].video.Location}
                      width="100%"
                      height="100%"
                      controls
                      onEnded={() => markCompleted()}
                    />
                  </div>
                )}

              <ReactMarkdown
                source={course.lessons[clicked].content}
                className="lesson-content"
              />
            </>
          ) : (
            <div className="welcome-message">
              <PlayCircleOutlined className="play-icon" />
              <p>Click on the lessons to start learning</p>
            </div>
          )}
        </div>
      </div>
    </StudentRoute>
  );
};

export default SingleCourse;
