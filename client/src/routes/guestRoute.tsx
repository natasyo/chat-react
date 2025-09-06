import { useAuthStore } from '../store/AuthStore.tsx';
import { Navigate, Outlet } from 'react-router-dom';

const GuestRoute = () => {
  const store = useAuthStore();
  return (
    <div>
      {!store.jwt ? <Outlet /> : <Navigate to={`/`} />}
    </div>
  );
};

export default GuestRoute;
