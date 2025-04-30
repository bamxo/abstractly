import AuthForm from './AuthForm';
import AuthLayout from './AuthLayout';

const Login = () => {
  return (
    <AuthLayout>
      <AuthForm type="login" />
    </AuthLayout>
  );
};

export default Login; 