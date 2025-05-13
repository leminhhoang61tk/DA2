import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
    const [open, setOpen] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Nếu không có user, chuyển hướng đến trang đăng nhập
    React.useEffect(() => {
        if (!user) {
            navigate('/auth/login');
        }
    }, [user, navigate]);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Topbar open={open} handleDrawerToggle={handleDrawerToggle} />
            <Sidebar open={open} handleDrawerToggle={handleDrawerToggle} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${open ? 240 : 0}px)` },
                    ml: { md: `${open ? 240 : 0}px` },
                    transition: (theme) => theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    backgroundColor: 'background.default',
                }}
            >
                <Toolbar />
                <Box sx={{ py: 2 }}>
                    <Outlet />
                </Box>
                <Footer />
            </Box>
        </Box>
    );
};

export default DashboardLayout;