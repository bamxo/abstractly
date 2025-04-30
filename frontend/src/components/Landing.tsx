import { Link } from 'react-router-dom';
import styles from './Landing.module.css';

const Landing = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Abstractly</h1>
        <p className={styles.description}>Your modern research companion that helps you stay organized and productive.</p>
        
        <div className={styles.buttonContainer}>
          <Link
            to="/login"
            className={styles.loginButton}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className={styles.signupButton}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing; 