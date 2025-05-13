import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Các vai trò trong hệ thống
export const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    DISPATCHER: 'dispatcher',
    DRIVER: 'driver',
    CUSTOMER: 'customer',
};

// Quyền hạn cho từng vai trò
export const PERMISSIONS = {
    [ROLES.ADMIN]: [
        'view_all_orders',
        'manage_orders',
        'view_all_customers',
        'manage_customers',
        'view_all_drivers',
        'manage_drivers',
        'view_analytics',
        'manage_settings',
        'manage_users',
        'view_inventory',
        'manage_inventory',
    ],
    [ROLES.MANAGER]: [
        'view_all_orders',
        'manage_orders',
        'view_all_customers',
        'view_all_drivers',
        'view_analytics',
        'view_inventory',
        'manage_inventory',
    ],
    [ROLES.DISPATCHER]: [
        'view_all_orders',
        'manage_orders',
        'view_all_drivers',
        'view_inventory',
    ],
    [ROLES.DRIVER]: [
        'view_assigned_orders',
        'update_order_status',
        'view_route',
    ],
    [ROLES.CUSTOMER]: [
        'view_own_orders',
        'create_order',
        'view_order_history',
        'update_profile',
    ],
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Kiểm tra xác thực người dùng từ localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Kiểm tra quyền của người dùng
    const hasPermission = (permission) => {
        if (!user || !user.role) return false;
        return PERMISSIONS[user.role].includes(permission);
    };

    // Kiểm tra vai trò của người dùng
    const hasRole = (role) => {
        if (!user || !user.role) return false;
        return user.role === role;
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            hasPermission,
            hasRole,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);