import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user information from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        // Extract username from email (portion before @)
        if (user.email) {
          const name = user.email.split('@')[0];
          setUserName(name);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleSignOut = () => {
    // Clear auth data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <div className={styles.userInfo}>
          <span>Welcome, {userName || 'User'}!</span>
          <button 
            className={styles.signOutButton}
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
      <div className={styles.content}>
        <p>Welcome to your dashboard!</p>
      </div>
    </div>
  );
};

export default Dashboard; 