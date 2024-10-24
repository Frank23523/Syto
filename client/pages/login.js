import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from '../context';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  const router = useRouter();

  useEffect(() => {
    if (user !== null) router.push('/');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/login`, {
        email,
        password,
      });
      dispatch({
        type: 'LOGIN',
        payload: data,
      });
      window.localStorage.setItem('user', JSON.stringify(data));
      router.push('/user');
    } catch (err) {
      toast(err.response.data);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <h1 className="auth-title">Login to Syto</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
        />
        <input
          type="password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />
        <button type="submit" className="primary-button">
          {loading ? <SyncOutlined spin /> : 'Login'}
        </button>
      </form>
      <p className="auth-link">
        Not yet registered? <Link href="/register">Register</Link>
      </p>
      <p className="auth-link">
        <Link href="/forgot-password">Forgot password?</Link>
      </p>
    </div>
  );
};

export default Login;
