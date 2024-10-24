import TopNav from '../components/TopNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';
import '../public/css/styles.css';
import '../public/css/colors.css';
import '../public/css/animations.css';
import '../public/css/buttons.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from '../context';

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <ToastContainer position="top-center" />
      <TopNav />
      <div className="main-layout">
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

export default MyApp;
