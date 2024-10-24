import { Select, Button, Avatar, Badge, Input, Tooltip } from 'antd';
import {
  DollarOutlined,
  FileImageOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const CourseCreateForm = ({
  handleSubmit,
  handleImage,
  handleChange,
  values,
  setValues,
  preview,
  uploadButtonText,
  handleImageRemove = (f) => f,
  editPage = false,
}) => {
  const children = [];
  for (let i = 9.99; i <= 99.99; i++) {
    children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>);
  }

  return (
    <>
      {values && (
        <form onSubmit={handleSubmit} className="course-form">
          {/* Course Name */}
          <div className="form-group">
            <Input
              type="text"
              name="name"
              size="large"
              placeholder="Course Name"
              prefix={<InfoCircleOutlined />}
              value={values.name}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Course Description */}
          <div className="form-group">
            <TextArea
              name="description"
              placeholder="Course Description"
              rows={6}
              value={values.description}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Paid/Free Toggle */}
          <div className="form-row">
            <div className="col">
              <div className="form-group">
                <Select
                  style={{ width: '100%' }}
                  size="large"
                  value={values.paid}
                  onChange={(v) => setValues({ ...values, paid: v, price: 0 })}
                  className="input-select"
                >
                  <Option value={true}>Paid</Option>
                  <Option value={false}>Free</Option>
                </Select>
              </div>
            </div>
          </div>

          {/* Price Selection */}
          {values.paid && (
            <div className="form-group">
              <Select
                defaultValue="$9.99"
                style={{ width: '100%' }}
                onChange={(v) => setValues({ ...values, price: v })}
                size="large"
                className="input-select"
                prefix={<DollarOutlined />}
              >
                {children}
              </Select>
            </div>
          )}

          {/* Course Category */}
          <div className="form-group">
            <Input
              type="text"
              name="category"
              size="large"
              placeholder="Course Category"
              prefix={<InfoCircleOutlined />}
              value={values.category}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Image Upload */}
          <div className="form-row">
            <div className="col">
              <div className="form-group">
                <Tooltip title="Upload a course image">
                  <label className="upload-btn">
                    <FileImageOutlined className="icon" />
                    {uploadButtonText}
                    <input
                      type="file"
                      name="image"
                      onChange={handleImage}
                      accept="image/*"
                      hidden
                    />
                  </label>
                </Tooltip>
              </div>
            </div>

            {/* Image Preview */}
            {preview && (
              <Badge count="X" onClick={handleImageRemove} className="pointer">
                <Avatar
                  src={preview}
                  size={80}
                  shape="square"
                  className="preview-avatar"
                />
              </Badge>
            )}

            {/* Show existing image on edit */}
            {editPage && values.image && (
              <Avatar
                src={values.image.Location}
                size={80}
                shape="square"
                className="preview-avatar"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="row">
            <div className="col">
              <Button
                onClick={handleSubmit}
                disabled={values.loading || values.uploading}
                type="primary"
                size="large"
                shape="round"
                className="submit-btn"
                loading={values.loading}
              >
                {values.loading ? 'Saving...' : 'Save & Continue'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CourseCreateForm;
