import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import { Context } from '../context';
import { useRouter } from 'next/router';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    state: { user },
  } = useContext(Context);

  const router = useRouter();

  useEffect(() => {
    if (user !== null) router.push('/');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/forgot-password', { email });
      setSuccess(true);
      toast('Check your email for the secret code');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast(err.response.data);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post('/api/reset-password', {
        email,
        code,
        newPassword,
      });
      setEmail('');
      setCode('');
      setNewPassword('');
      setLoading(false);
      toast('Great! Now you can login with your new password');
      router.push('/login');
    } catch (err) {
      setLoading(false);
      toast(err.response.data);
    }
  };

  return (
    <div className="auth-container fade-in">
      <h1 className="auth-title">Reset Your Password</h1>
      <form
        onSubmit={success ? handleResetPassword : handleSubmit}
        className="auth-form"
      >
        <input
          type="email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
        />
        {success && (
          <>
            <input
              type="text"
              className="auth-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter secret code"
              required
            />
            <input
              type="password"
              className="auth-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </>
        )}
        <button type="submit" className="primary-button">
          {loading ? <SyncOutlined spin /> : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
