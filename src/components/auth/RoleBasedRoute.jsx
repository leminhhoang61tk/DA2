import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';
import Forbidden from '../../pages/errors/Forbidden';

const RoleBasedRoute = ({ requiredPermission, requiredRole, children }) => {
    const { user, loading, hasPermission, hasRole } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader message="Đang xác thực..." />;
    }

    if (!user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // Kiểm tra quyền hoặc vai trò nếu được yêu cầu
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Forbidden />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <Forbidden />;
    }

    return children;
};

export default RoleBasedRoute;