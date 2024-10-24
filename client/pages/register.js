import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from '../context';
import { useRouter } from 'next/router';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/register`, {
        name,
        email,
        password,
      });
      toast('Registration successful. Please login.');
      setName('');
      setEmail('');
      setPassword('');
      setLoading(false);
      router.push('/login');
    } catch (err) {
      toast(err.response.data);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <h1 className="auth-title">Create Your Syto Account</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          className="auth-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          required
        />
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
          {loading ? <SyncOutlined spin /> : 'Register'}
        </button>
      </form>
      <p className="auth-link">
        Already registered? <Link href="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
