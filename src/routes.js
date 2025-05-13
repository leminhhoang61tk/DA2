// src/routes.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import MinimalLayout from './layouts/MinimalLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Error pages
import NotFound from './pages/errors/NotFound';
import Forbidden from './pages/errors/Forbidden';
import ServerError from './pages/errors/ServerError';
import Maintenance from './pages/errors/Maintenance';

// Role-based dashboards
import AdminDashboard from './pages/admin/Dashboard';
import ManagerDashboard from './pages/manager/Dashboard';
import DispatcherDashboard from './pages/dispatcher/Dashboard';
import DriverDashboard from './pages/driver/Dashboard';
import CustomerDashboard from './pages/customer/Dashboard';

// Định nghĩa các route
const routes = [
    {
        path: '/',
        element: <Navigate to="/auth/login" />,
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            { path: '', element: <Navigate to="/auth/login" /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'forgot-password', element: <ForgotPassword /> },
            { path: 'reset-password', element: <ResetPassword /> },
        ],
    },
    {
        path: '/admin',
        element: <DashboardLayout />,
        children: [
            { path: '', element: <Navigate to="/admin/dashboard" /> },
            { path: 'dashboard', element: <AdminDashboard /> },
            // Thêm các route khác cho admin
        ],
    },
    {
        path: '/manager',
        element: <DashboardLayout />,
        children: [
            { path: '', element: <Navigate to="/manager/dashboard" /> },
            { path: 'dashboard', element: <ManagerDashboard /> },
            // Thêm các route khác cho manager
        ],
    },
    {
        path: '/dispatcher',
        element: <DashboardLayout />,
        children: [
            { path: '', element: <Navigate to="/dispatcher/dashboard" /> },
            { path: 'dashboard', element: <DispatcherDashboard /> },
            // Thêm các route khác cho dispatcher
        ],
    },
    {
        path: '/driver',
        element: <DashboardLayout />,
        children: [
            { path: '', element: <Navigate to="/driver/dashboard" /> },
            { path: 'dashboard', element: <DriverDashboard /> },
            // Thêm các route khác cho driver
        ],
    },
    {
        path: '/customer',
        element: <DashboardLayout />,
        children: [
            { path: '', element: <Navigate to="/customer/dashboard" /> },
            { path: 'dashboard', element: <CustomerDashboard /> },
            // Thêm các route khác cho customer
        ],
    },
    {
        path: '/error',
        element: <MinimalLayout />,
        children: [
            { path: '404', element: <NotFound /> },
            { path: '403', element: <Forbidden /> },
            { path: '500', element: <ServerError /> },
            { path: 'maintenance', element: <Maintenance /> },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/error/404" />,
    },
];

export default routes;
