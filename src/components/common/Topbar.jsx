import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Avatar,
    Badge,
    Tooltip,
    Divider,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    AccountCircle,
    Settings as SettingsIcon,
    Logout,
    Person as PersonIcon,
    Help as HelpIcon,
} from '@mui/icons-material';
import { useAuth, ROLES } from '../../context/AuthContext';

const Topbar = ({ open, handleDrawerToggle }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationMenu = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    // Lấy tên hiển thị cho vai trò
    const getRoleName = (role) => {
        switch (role) {
            case ROLES.ADMIN:
                return 'Quản trị viên';
            case ROLES.MANAGER:
                return 'Quản lý';
            case ROLES.DISPATCHER:
                return 'Điều phối viên';
            case ROLES.DRIVER:
                return 'Tài xế';
            case ROLES.CUSTOMER:
                return 'Khách hàng';
            default:
                return 'Người dùng';
        }
    };

    // Lấy đường dẫn dashboard dựa trên vai trò
    const getDashboardPath = (role) => {
        switch (role) {
            case ROLES.ADMIN:
                return '/admin/dashboard';
            case ROLES.MANAGER:
                return '/manager/dashboard';
            case ROLES.DISPATCHER:
                return '/dispatcher/dashboard';
            case ROLES.DRIVER:
                return '/driver/dashboard';
            case ROLES.CUSTOMER:
                return '/customer/dashboard';
            default:
                return '/dashboard';
        }
    };

    // Dữ liệu thông báo giả
    const notifications = [
        {
            id: 1,
            message: 'Đơn hàng #ORD-2025-0015 đã được giao thành công',
            time: '10 phút trước',
            read: false,
        },
        {
            id: 2,
            message: 'Tài xế Nguyễn Văn A đã nhận đơn hàng #ORD-2025-0016',
            time: '30 phút trước',
            read: false,
        },
        {
            id: 3,
            message: 'Đơn hàng #ORD-2025-0014 đang được xử lý',
            time: '1 giờ trước',
            read: true,
        },
    ];

    // Đếm số thông báo chưa đọc
    const unreadCount = notifications.filter(notification => !notification.read).length;

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { md: open ? `calc(100% - 240px)` : '100%' },
                ml: { md: open ? `240px` : 0 },
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: 'background.paper',
                color: 'text.primary',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }}
                >
                    {user ? `${getRoleName(user.role)} Dashboard` : 'SmartShipD'}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Notifications */}
                    <Tooltip title="Thông báo">
                        <IconButton
                            size="large"
                            color="inherit"
                            onClick={handleNotificationMenu}
                        >
                            <Badge badgeContent={unreadCount} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        id="notification-menu"
                        anchorEl={notificationAnchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(notificationAnchorEl)}
                        onClose={handleNotificationClose}
                        PaperProps={{
                            sx: {
                                width: 320,
                                maxHeight: 400,
                                overflow: 'auto',
                            },
                        }}
                    >
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6">Thông báo</Typography>
                        </Box>
                        <Divider />
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <MenuItem
                                    key={notification.id}
                                    onClick={handleNotificationClose}
                                    sx={{
                                        py: 1.5,
                                        px: 2,
                                        borderLeft: notification.read ? 'none' : '3px solid',
                                        borderColor: 'primary.main',
                                        bgcolor: notification.read ? 'inherit' : 'action.hover',
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2">{notification.message}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {notification.time}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>
                                <Typography variant="body2">Không có thông báo mới</Typography>
                            </MenuItem>
                        )}
                        <Divider />
                        <Box sx={{ p: 1, textAlign: 'center' }}>
                            <Typography
                                variant="body2"
                                color="primary"
                                sx={{ cursor: 'pointer' }}
                                onClick={() => {
                                    handleNotificationClose();
                                    // Xử lý xem tất cả thông báo
                                }}
                            >
                                Xem tất cả thông báo
                            </Typography>
                        </Box>
                    </Menu>

                    {/* User menu */}
                    <Tooltip title="Tài khoản">
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                            sx={{ ml: 1 }}
                        >
                            {user && user.avatar ? (
                                <Avatar
                                    alt={user.name}
                                    src={user.avatar}
                                    sx={{ width: 32, height: 32 }}
                                />
                            ) : (
                                <AccountCircle />
                            )}
                        </IconButton>
                    </Tooltip>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        {user && (
                            <Box sx={{ px: 2, py: 1.5 }}>
                                <Typography variant="subtitle1" fontWeight="medium">
                                    {user.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user.email}
                                </Typography>
                                <Typography variant="caption" color="primary">
                                    {getRoleName(user.role)}
                                </Typography>
                            </Box>
                        )}
                        <Divider />
                        <MenuItem onClick={() => {
                            handleMenuClose();
                            navigate(user ? `${getDashboardPath(user.role)}` : '/dashboard');
                        }}>
                            <PersonIcon sx={{ mr: 2 }} /> Thông tin cá nhân
                        </MenuItem>
                        <MenuItem onClick={() => {
                            handleMenuClose();
                            navigate('/settings');
                        }}>
                            <SettingsIcon sx={{ mr: 2 }} /> Cài đặt
                        </MenuItem>
                        <MenuItem onClick={() => {
                            handleMenuClose();
                            navigate('/help');
                        }}>
                            <HelpIcon sx={{ mr: 2 }} /> Trợ giúp
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => {
                            handleMenuClose();
                            logout();
                            navigate('/auth/login');
                        }}>
                            <Logout sx={{ mr: 2 }} /> Đăng xuất
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;