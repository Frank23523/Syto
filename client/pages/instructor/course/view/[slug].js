import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import axios from 'axios';
import {
  Avatar,
  Tooltip,
  Button,
  Modal,
  List,
  Progress,
  Typography,
} from 'antd';
import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  QuestionOutlined,
  CloseOutlined,
  UserSwitchOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import AddLessonForm from '../../../../components/forms/AddLessonForm';
import { toast } from 'react-toastify';
import Item from 'antd/lib/list/Item';

const { Title, Text } = Typography;

const CourseView = () => {
  const [course, setCourse] = useState({});
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    title: '',
    content: '',
    video: {},
  });
  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState('Upload Video');
  const [progress, setProgress] = useState(0);
  const [students, setStudents] = useState(0);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  useEffect(() => {
    course && studentCount();
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };

  const studentCount = async () => {
    const { data } = await axios.post(`/api/instructor/student-count`, {
      courseId: course._id,
    });
    setStudents(data.length);
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values,
      );
      setValues({ ...values, title: '', content: '', video: {} });
      setProgress(0);
      setUploadButtonText('Upload video');
      setVisible(false);
      setCourse(data);
      toast.success('Lesson added successfully!');
    } catch (err) {
      toast.error('Failed to add lesson');
    }
  };

  const handleVideo = async (e) => {
    try {
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      setUploading(true);

      const videoData = new FormData();
      videoData.append('video', file);
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        },
      );
      setValues({ ...values, video: data });
      setUploading(false);
    } catch (err) {
      setUploading(false);
      toast.error('Video upload failed');
    }
  };

  const handleVideoRemove = async () => {
    try {
      setUploading(true);
      await axios.post(
        `/api/course/video-remove/${course.instructor._id}`,
        values.video,
      );
      setValues({ ...values, video: {} });
      setUploading(false);
      setUploadButtonText('Upload another video');
    } catch (err) {
      setUploading(false);
      toast.error('Failed to remove video');
    }
  };

  const handlePublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        'Once you publish, your course will be live on the marketplace for users to enroll.',
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/publish/${courseId}`);
      setCourse(data);
      toast.success('Your course is now live!');
    } catch (err) {
      toast.error('Failed to publish the course. Try again.');
    }
  };

  const handleUnpublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        'Once you unpublish, your course will no longer be available for users to enroll.',
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      setCourse(data);
      toast.warning('Your course is unpublished.');
    } catch (err) {
      toast.error('Failed to unpublish. Try again.');
    }
  };

  return (
    <InstructorRoute>
      <div className="container-fluid pt-3 course-view">
        {course && (
          <div className="container-fluid pt-1">
            <div className="media pt-2">
              <Avatar
                size={80}
                src={course.image ? course.image.Location : '/course.png'}
                className="course-avatar"
              />

              <div className="media-body pl-3">
                <div className="row">
                  <div className="col">
                    <Title level={4} className="course-title text-primary">
                      {course.name}
                    </Title>
                    <Text type="secondary">
                      {course.lessons && course.lessons.length} Lessons
                    </Text>
                    <p className="category-label">
                      Category: <strong>{course.category}</strong>
                    </p>
                  </div>

                  <div className="d-flex pt-2 action-icons">
                    <Tooltip title={`${students} Enrolled`}>
                      <UserSwitchOutlined className="icon-action text-info" />
                    </Tooltip>
                    <Tooltip title="Edit Course">
                      <EditOutlined
                        onClick={() =>
                          router.push(`/instructor/course/edit/${slug}`)
                        }
                        className="icon-action text-warning"
                      />
                    </Tooltip>

                    {course.lessons && course.lessons.length < 5 ? (
                      <Tooltip title="Min 5 lessons required to publish">
                        <QuestionOutlined className="icon-action text-danger" />
                      </Tooltip>
                    ) : course.published ? (
                      <Tooltip title="Unpublish">
                        <CloseOutlined
                          onClick={(e) => handleUnpublish(e, course._id)}
                          className="icon-action text-danger"
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Publish">
                        <CheckOutlined
                          onClick={(e) => handlePublish(e, course._id)}
                          className="icon-action text-success"
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="course-description">
              <ReactMarkdown source={course.description} />
            </div>
            <div className="row text-center mb-4">
              <Button
                onClick={() => setVisible(true)}
                className="col-md-6 offset-md-3 add-lesson-btn"
                type="primary"
                shape="round"
                icon={<UploadOutlined />}
                size="large"
              >
                Add Lesson
              </Button>
            </div>

            <Modal
              title="+ Add Lesson"
              centered
              visible={visible}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <AddLessonForm
                values={values}
                setValues={setValues}
                handleAddLesson={handleAddLesson}
                uploading={uploading}
                uploadButtonText={uploadButtonText}
                handleVideo={handleVideo}
                progress={progress}
                handleVideoRemove={handleVideoRemove}
              />
              {uploading && <Progress percent={progress} />}
            </Modal>

            <div className="row pb-5">
              <div className="col lesson-list">
                <h4 className="lesson-title">
                  {course && course.lessons && course.lessons.length} Lessons
                </h4>
                <List
                  itemLayout="horizontal"
                  dataSource={course && course.lessons}
                  renderItem={(item, index) => (
                    <Item>
                      <Item.Meta
                        avatar={<Avatar>{index + 1}</Avatar>}
                        title={<Text>{item.title}</Text>}
                        description={
                          <PlayCircleOutlined className="play-icon" />
                        }
                      />
                    </Item>
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorRoute>
  );
};

export default CourseView;
