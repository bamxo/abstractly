import React from 'react';
import GradientBackgroundWrapper from './GradientBackgroundWrapper';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <>
      <GradientBackgroundWrapper />
      <div className={styles.authContainer}>
        {children}
      </div>
    </>
  );
};

export default AuthLayout; 