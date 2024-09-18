import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));

  // 토큰 변경 감지
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('accessToken'));
    };

    // localStorage가 변경될 때 감지
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
