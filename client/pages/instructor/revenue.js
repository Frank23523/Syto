import { useState, useEffect, useContext } from 'react';
import InstructorRoute from '../../components/routes/InstructorRoute';
import axios from 'axios';
import {
  DollarOutlined,
  SettingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { stripeCurrencyFormatter } from '../../utils/helpers';

const InstructorRevenue = () => {
  const [balance, setBalance] = useState({ pending: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sendBalanceRequest();
  }, []);

  const sendBalanceRequest = async () => {
    const { data } = await axios.get('/api/instructor/balance');
    setBalance(data);
  };

  const handlePayoutSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/instructor/payout');
      window.location.href = data;
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert('Unable to access payout settings. Try later.');
    }
  };

  return (
    <InstructorRoute>
      <div className="container">
        <div className="revenue-report bg-light p-5 rounded shadow">
          <h2>
            Revenue Report{' '}
            <DollarOutlined className="float-right text-success" />
          </h2>
          <p className="text-muted">
            Payments are processed automatically every 48 hours
          </p>
          <hr />

          <h4>Pending Balance</h4>
          {balance.pending && balance.pending.length > 0 ? (
            balance.pending.map((bp, i) => (
              <span key={i} className="pending-amount">
                {stripeCurrencyFormatter(bp)}
              </span>
            ))
          ) : (
            <p>No pending balance</p>
          )}
          <small>These will be processed within 48 hours</small>
          <hr />

          <h4>
            Payouts
            {loading ? (
              <SyncOutlined
                spin
                style={{ float: 'right' }}
                className="pointer text-primary"
              />
            ) : (
              <SettingOutlined
                style={{ float: 'right' }}
                className="pointer text-primary"
                onClick={handlePayoutSettings}
              />
            )}
          </h4>
          <p className="text-muted">
            Update your stripe account details or view previous payouts
          </p>
        </div>
      </div>
    </InstructorRoute>
  );
};

export default InstructorRevenue;
