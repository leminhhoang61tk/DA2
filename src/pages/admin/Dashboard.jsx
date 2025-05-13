import React from 'react';
import { Grid, Typography, Paper, Box, Card, CardContent, CardHeader, Divider } from '@mui/material';
import {
    People as PeopleIcon,
    LocalShipping as LocalShippingIcon,
    Inventory as InventoryIcon,
    AttachMoney as AttachMoneyIcon,
    Assignment as AssignmentIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    BarChart as BarChartIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const { user } = useAuth();

    // Dữ liệu cho biểu đồ
    const orderData = {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
            {
                label: 'Đơn hàng',
                data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90],
                backgroundColor: 'rgba(25, 118, 210, 0.6)',
            },
        ],
    };

    const revenueData = {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
            {
                label: 'Doanh thu (triệu VNĐ)',
                data: [120, 110, 150, 160, 130, 140, 100, 110, 140, 150, 170, 180],
                backgroundColor: 'rgba(46, 125, 50, 0.6)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
    };

    // Dữ liệu tổng quan
    const summaryData = [
        { title: 'Tổng đơn hàng', value: '1,254', icon: <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} /> },
        { title: 'Tổng doanh thu', value: '1.5 tỷ VNĐ', icon: <AttachMoneyIcon sx={{ fontSize: 40, color: 'success.main' }} /> },
        { title: 'Số lượng khách hàng', value: '245', icon: <PeopleIcon sx={{ fontSize: 40, color: 'info.main' }} /> },
        { title: 'Số lượng tài xế', value: '32', icon: <LocalShippingIcon sx={{ fontSize: 40, color: 'warning.main' }} /> },
    ];

    // Dữ liệu truy cập nhanh
    const quickAccessItems = [
        { title: 'Quản lý người dùng', icon: <PersonIcon />, link: '/admin/users' },
        { title: 'Quản lý đơn hàng', icon: <AssignmentIcon />, link: '/admin/orders' },
        { title: 'Quản lý kho hàng', icon: <InventoryIcon />, link: '/admin/inventory' },
        { title: 'Báo cáo thống kê', icon: <BarChartIcon />, link: '/admin/analytics' },
        { title: 'Cài đặt hệ thống', icon: <SettingsIcon />, link: '/admin/settings' },
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Xin chào, {user.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Chào mừng đến với Bảng điều khiển Quản trị viên. Đây là tổng quan về hệ thống của bạn.
            </Typography>

            {/* Thẻ tổng quan */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {summaryData.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ mr: 2 }}>{item.icon}</Box>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">{item.value}</Typography>
                                    <Typography variant="body2" color="text.secondary">{item.title}</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Biểu đồ */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardHeader title="Số lượng đơn hàng theo tháng" />
                        <Divider />
                        <CardContent>
                            <Box sx={{ height: 300 }}>
                                <Bar options={chartOptions} data={orderData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardHeader title="Doanh thu theo tháng" />
                        <Divider />
                        <CardContent>
                            <Box sx={{ height: 300 }}>
                                <Bar options={chartOptions} data={revenueData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Truy cập nhanh */}
            <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', mb: 4 }}>
                <CardHeader title="Truy cập nhanh" />
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        {quickAccessItems.map((item, index) => (
                            <Grid item xs={6} sm={4} md={2.4} key={index}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            backgroundColor: 'primary.light',
                                            color: 'primary.contrastText',
                                            transform: 'translateY(-5px)',
                                        },
                                    }}
                                    onClick={() => {/* Xử lý chuyển hướng */ }}
                                >
                                    <Box sx={{ mb: 1 }}>{item.icon}</Box>
                                    <Typography variant="body2" fontWeight="medium">
                                        {item.title}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            {/* Thông tin hệ thống */}
            <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                <CardHeader title="Thông tin hệ thống" />
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="body2" color="text.secondary">Phiên bản hệ thống</Typography>
                            <Typography variant="body1" fontWeight="medium">SmartShipD v1.0.5</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="body2" color="text.secondary">Cập nhật gần nhất</Typography>
                            <Typography variant="body1" fontWeight="medium">23/04/2025 08:30</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="body2" color="text.secondary">Trạng thái hệ thống</Typography>
                            <Typography variant="body1" fontWeight="medium" sx={{ color: 'success.main' }}>
                                Hoạt động bình thường
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AdminDashboard;