import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';

interface AuthProtectedRouteProps {
  children: React.ReactNode;
}

const AuthProtectedRoute = ({ children }: AuthProtectedRouteProps) => {
  const { isAuthed } = useAuth();
  return isAuthed ? <>{children}</> : <Navigate to={'/'} replace />;
};

export default AuthProtectedRoute;
