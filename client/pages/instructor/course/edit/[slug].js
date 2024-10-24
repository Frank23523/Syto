import { useState, useEffect } from 'react';
import axios from 'axios';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import CourseCreateForm from '../../../../components/forms/CourseCreateForm';
import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { List, Avatar, Modal, Typography, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import UpdateLessonForm from '../../../../components/forms/UpdateLessonForm';

const { Item } = List;
const { Title } = Typography;

const CourseEdit = () => {
  // state
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '9.99',
    uploading: false,
    paid: true,
    category: '',
    loading: false,
    lessons: [],
  });
  const [image, setImage] = useState({});
  const [preview, setPreview] = useState('');
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image');

  // state for lessons update
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [uploadVideoButtonText, setUploadVideoButtonText] =
    useState('Upload Video');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    if (data) setValues(data);
    if (data && data.image) setImage(data.image);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async (url) => {
      try {
        let { data } = await axios.post('/api/course/upload-image', {
          image: url,
        });
        setImage(data);
        setValues({ ...values, loading: false });
      } catch (err) {
        setValues({ ...values, loading: false });
        toast.error('Image upload failed. Try later.');
      }
    });
  };

  const handleImageRemove = async () => {
    try {
      setValues({ ...values, loading: true });
      const res = await axios.post('/api/course/remove-image', { image });
      setImage({});
      setPreview('');
      setUploadButtonText('Upload Image');
      setValues({ ...values, loading: false });
    } catch (err) {
      setValues({ ...values, loading: false });
      toast.error('Image removal failed. Try later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      toast.success('Course updated!');
      router.push('/instructor');
    } catch (err) {
      toast.error('Failed to update course.');
    }
  };

  const handleDrag = (e, index) => {
    e.dataTransfer.setData('itemIndex', index);
  };

  const handleDrop = async (e, index) => {
    const movingItemIndex = e.dataTransfer.getData('itemIndex');
    const targetItemIndex = index;
    let allLessons = values.lessons;

    let movingItem = allLessons[movingItemIndex];
    allLessons.splice(movingItemIndex, 1);
    allLessons.splice(targetItemIndex, 0, movingItem);

    setValues({ ...values, lessons: [...allLessons] });

    const { data } = await axios.put(`/api/course/${slug}`, {
      ...values,
      image,
    });
    toast.success('Lessons rearranged successfully');
  };

  const handleDelete = async (index) => {
    const answer = window.confirm('Are you sure you want to delete?');
    if (!answer) return;
    let allLessons = values.lessons;
    const removed = allLessons.splice(index, 1);
    setValues({ ...values, lessons: allLessons });

    const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
    toast.success('Lesson deleted');
  };

  const handleVideo = async (e) => {
    if (current.video && current.video.Location) {
      const res = await axios.post(
        `/api/course/video-remove/${values.instructor._id}`,
        current.video,
      );
    }

    const file = e.target.files[0];
    setUploadVideoButtonText(file.name);
    setUploading(true);
    const videoData = new FormData();
    videoData.append('video', file);
    videoData.append('courseId', values._id);

    const { data } = await axios.post(
      `/api/course/video-upload/${values.instructor._id}`,
      videoData,
      {
        onUploadProgress: (e) =>
          setProgress(Math.round((100 * e.loaded) / e.total)),
      },
    );
    setCurrent({ ...current, video: data });
    setUploading(false);
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    const { data } = await axios.put(
      `/api/course/lesson/${slug}/${current._id}`,
      current,
    );
    setUploadVideoButtonText('Upload Video');
    setVisible(false);
    if (data.ok) {
      let arr = values.lessons;
      const index = arr.findIndex((el) => el._id === current._id);
      arr[index] = current;
      setValues({ ...values, lessons: arr });
      toast.success('Lesson updated');
    }
  };

  return (
    <InstructorRoute>
      <div className="edit-course-page">
        <Title level={2} className="page-title">
          Update Course
        </Title>
        <div className="course-form">
          <CourseCreateForm
            handleSubmit={handleSubmit}
            handleImageRemove={handleImageRemove}
            handleImage={handleImage}
            handleChange={handleChange}
            values={values}
            setValues={setValues}
            preview={preview}
            uploadButtonText={uploadButtonText}
            editPage={true}
          />
        </div>
        <hr />
        <div className="lesson-list-section">
          <Title level={4} className="lessons-title">
            {values && values.lessons && values.lessons.length} Lessons
          </Title>
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout="horizontal"
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <Item
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <Tooltip title="Click to Edit">
                  <Item.Meta
                    onClick={() => {
                      setVisible(true);
                      setCurrent(item);
                    }}
                    avatar={<Avatar>{index + 1}</Avatar>}
                    title={item.title}
                  />
                </Tooltip>
                <DeleteOutlined
                  onClick={() => handleDelete(index)}
                  className="delete-icon"
                />
              </Item>
            )}
          />
        </div>
        <Modal
          title="Update Lesson"
          centered
          visible={visible}
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <UpdateLessonForm
            current={current}
            setCurrent={setCurrent}
            handleVideo={handleVideo}
            handleUpdateLesson={handleUpdateLesson}
            uploadVideoButtonText={uploadVideoButtonText}
            progress={progress}
            uploading={uploading}
          />
        </Modal>
      </div>
    </InstructorRoute>
  );
};

export default CourseEdit;
