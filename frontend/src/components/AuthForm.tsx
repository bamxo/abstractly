import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

interface AuthFormProps {
  type: 'login' | 'signup';
}

const API_URL = 'http://localhost:3000';

interface AuthResponse {
  message: string;
  user: {
    uid: string;
    email: string;
    token: string;
  };
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form data
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all required fields');
      }

      if (type === 'signup' && formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Submit to backend
      let response;
      if (type === 'login') {
        response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await axios.post<AuthResponse>(`${API_URL}/auth/signup`, {
          email: formData.email,
          password: formData.password,
        });
      }
        
      // Save token to localStorage
      localStorage.setItem('token', response.data.user.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
        
      // Redirect to dashboard or home
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2 className={styles.title}>
          {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={type === 'signup' ? (showPasswords ? "text" : "password") : (showPasswords ? "text" : "password")}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                required
              />
              <button
                type="button"
                className={styles.eyeIcon}
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>

          {type === 'signup' && (
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showPasswords ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeIcon}
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading 
              ? 'Processing...' 
              : type === 'login' 
                ? 'Sign In' 
                : 'Sign Up'
            }
          </button>
        </form>

        <p className={styles.switchText}>
          {type === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <Link
            to={type === 'login' ? '/signup' : '/login'}
            className={styles.switchLink}
          >
            {type === 'login' ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm; 