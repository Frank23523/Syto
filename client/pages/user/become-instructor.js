import { useContext, useState } from 'react';
import { Context } from '../../context';
import { Button } from 'antd';
import axios from 'axios';
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';

const BecomeInstructor = () => {
  const [loading, setLoading] = useState(false);
  const {
    state: { user },
  } = useContext(Context);

  const becomeInstructor = () => {
    setLoading(true);
    axios
      .post('/api/make-instructor')
      .then((res) => {
        window.location.href = res.data;
      })
      .catch((err) => {
        toast('Stripe onboarding failed. Try again.');
        setLoading(false);
      });
  };

  return (
    <div className="become-instructor-container fade-in">
      <h1 className="text-center">Start Teaching on Syto</h1>
      <div className="instructor-setup">
        <UserSwitchOutlined className="icon-large" />
        <h2 className="pt-3">Set Up Payout to Publish Courses</h2>
        <p className="text-secondary">
          Syto partners with Stripe to transfer earnings directly to your bank
          account.
        </p>
        <Button
          className="primary-button large-btn"
          type="primary"
          shape="round"
          icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
          size="large"
          onClick={becomeInstructor}
          disabled={
            (user && user.role && user.role.includes('Instructor')) || loading
          }
        >
          {loading ? 'Processing...' : 'Setup Payout'}
        </Button>
        <p className="text-muted">
          You will be redirected to Stripe to complete the onboarding process.
        </p>
      </div>
    </div>
  );
};

export default BecomeInstructor;
