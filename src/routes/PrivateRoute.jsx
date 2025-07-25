import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children, roles }) {
    const { user } = useContext(AuthContext);

    if (!user) return <Navigate to="/login" />;

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" />;
    }

    return children;
}
