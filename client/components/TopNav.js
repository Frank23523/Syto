import { useState, useEffect, useContext } from 'react';
import { Menu, Avatar } from 'antd';
import Link from 'next/link';
import {
  AppstoreOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  CarryOutOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Context } from '../context';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const { Item, SubMenu } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState('');
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrent(window.location.pathname);
    }
  }, [typeof window !== 'undefined' && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: 'LOGOUT' });
    window.localStorage.removeItem('user');
    const { data } = await axios.get('/api/logout');
    toast(data.message);
    router.push('/login');
  };

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[current]}
      className="topnav-container"
    >
      <Item
        key="/"
        onClick={(e) => setCurrent(e.key)}
        icon={<AppstoreOutlined />}
      >
        <Link href="/">
          <a className="nav-link">Home</a>
        </Link>
      </Item>

      {user && user.role && user.role.includes('Instructor') ? (
        <Item
          key="/instructor/course/create"
          onClick={(e) => setCurrent(e.key)}
          icon={<CarryOutOutlined />}
        >
          <Link href="/instructor/course/create">
            <a className="nav-link">Create Course</a>
          </Link>
        </Item>
      ) : (
        <Item
          key="/user/become-instructor"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
        >
          <Link href="/user/become-instructor">
            <a className="nav-link">Become Instructor</a>
          </Link>
        </Item>
      )}

      {user === null && (
        <>
          <Item
            key="/login"
            onClick={(e) => setCurrent(e.key)}
            icon={<LoginOutlined />}
          >
            <Link href="/login">
              <a className="nav-link">Login</a>
            </Link>
          </Item>

          <Item
            key="/register"
            onClick={(e) => setCurrent(e.key)}
            icon={<UserAddOutlined />}
          >
            <Link href="/register">
              <a className="nav-link">Register</a>
            </Link>
          </Item>
        </>
      )}

      {user !== null && (
        <SubMenu
          icon={
            <Avatar style={{ backgroundColor: '#87d068' }}>
              {user.name.charAt(0)}
            </Avatar>
          }
          title={user && user.name}
          className="submenu-avatar"
        >
          <Item key="/user">
            <Link href="/user">
              <a className="nav-link">Dashboard</a>
            </Link>
          </Item>
          <Item onClick={logout}>
            <LogoutOutlined /> Logout
          </Item>
        </SubMenu>
      )}

      {user && user.role && user.role.includes('Instructor') && (
        <Item
          key="/instructor"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
          className="float-right instructor-link"
        >
          <Link href="/instructor">
            <a className="nav-link">Instructor</a>
          </Link>
        </Item>
      )}
    </Menu>
  );
};

export default TopNav;
