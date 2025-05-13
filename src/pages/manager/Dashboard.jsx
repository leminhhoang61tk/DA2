import React from 'react';
import { Grid, Typography, Paper, Box, Card, CardContent, CardHeader, Divider, List, ListItem, ListItemText, ListItemIcon, Chip } from '@mui/material';
import {
    Assignment as AssignmentIcon,
    LocalShipping as LocalShippingIcon,
    Inventory as InventoryIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ManagerDashboard = () => {
    const { user } = useAuth();

    // Dữ liệu biểu đồ trạng thái đơn hàng
    const orderStatusData = {
        labels: ['Đã giao', 'Đang giao', 'Đang xử lý', 'Đã hủy'],
        datasets: [
            {
                data: [45, 25, 20, 10],
                backgroundColor: [
                    'rgba(46, 125, 50, 0.7)',
                    'rgba(25, 118, 210, 0.7)',
                    'rgba(237, 108, 2, 0.7)',
                    'rgba(211, 47, 47, 0.7)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Dữ liệu biểu đồ phân bổ tài xế
    const driverAllocationData = {
        labels: ['Đang làm việc', 'Đang nghỉ', 'Đang bảo trì'],
        datasets: [
            {
                data: [20, 8, 4],
                backgroundColor: [
                    'rgba(25, 118, 210, 0.7)',
                    'rgba(237, 108, 2, 0.7)',
                    'rgba(211, 47, 47, 0.7)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Dữ liệu đơn hàng gần đây
    const recentOrders = [
        { id: 'ORD-2025-0010', customer: 'Công ty TNHH XYZ', status: 'DELIVERED', date: '24/04/2025' },
        { id: 'ORD-2025-0009', customer: 'Nguyễn Văn C', status: 'IN_TRANSIT', date: '24/04/2025' },
        { id: 'ORD-2025-0008', customer: 'Công ty CP ABC', status: 'PROCESSING', date: '23/04/2025' },
        { id: 'ORD-2025-0007', customer: 'Trần Thị D', status: 'CANCELLED', date: '23/04/2025' },
        { id: 'ORD-2025-0006', customer: 'Lê Văn E', status: 'DELIVERED', date: '22/04/2025' },
    ];

    // Dữ liệu cảnh báo kho hàng
    const inventoryAlerts = [
        { id: 1, product: 'Laptop Dell XPS 13', status: 'LOW_STOCK', quantity: 5 },
        { id: 2, product: 'iPhone 15 Pro Max', status: 'OUT_OF_STOCK', quantity: 0 },
        { id: 3, product: 'Samsung Galaxy S24', status: 'LOW_STOCK', quantity: 3 },
    ];

    // Dữ liệu tài xế đang hoạt động
    const activeDrivers = [
        { id: 1, name: 'Nguyễn Văn A', orders: 5, status: 'ACTIVE' },
        { id: 2, name: 'Trần Văn B', orders: 3, status: 'ACTIVE' },
        { id: 3, name: 'Lê Thị C', orders: 4, status: 'ACTIVE' },
        { id: 4, name: 'Phạm Văn D', orders: 2, status: 'BREAK' },
    ];

    // Hàm render trạng thái đơn hàng
    const renderOrderStatus = (status) => {
        switch (status) {
            case 'DELIVERED':
                return <Chip size="small" label="Đã giao" color="success" />;
            case 'IN_TRANSIT':
                return <Chip size="small" label="Đang giao" color="primary" />;
            case 'PROCESSING':
                return <Chip size="small" label="Đang xử lý" color="warning" />;
            case 'CANCELLED':
                return <Chip size="small" label="Đã hủy" color="error" />;
            default:
                return <Chip size="small" label={status} />;
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Xin chào, {user.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Chào mừng đến với Bảng điều khiển Quản lý. Đây là tổng quan về hoạt động vận hành.
            </Typography>

            <Grid container spacing={3}>
                {/* Biểu đồ trạng thái đơn hàng */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', height: '100%' }}>
                        <CardHeader title="Trạng thái đơn hàng" />
                        <Divider />
                        <CardContent>
                            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                                <Pie data={orderStatusData} options={{ maintainAspectRatio: false }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Biểu đồ phân bổ tài xế */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', height: '100%' }}>
                        <CardHeader title="Phân bổ tài xế" />
                        <Divider />
                        <CardContent>
                            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                                <Doughnut data={driverAllocationData} options={{ maintainAspectRatio: false }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Đơn hàng gần đây */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', height: '100%' }}>
                        <CardHeader
                            title="Đơn hàng gần đây"
                            action={
                                <Chip
                                    icon={<AssignmentIcon />}
                                    label="Xem tất cả"
                                    clickable
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                />
                            }
                        />
                        <Divider />
                        <CardContent sx={{ p: 0 }}>
                            <List>
                                {recentOrders.map((order) => (
                                    <React.Fragment key={order.id}>
                                        <ListItem>
                                            <ListItemIcon>
                                                <AssignmentIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={order.id}
                                                secondary={order.customer}
                                            />
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                {renderOrderStatus(order.status)}
                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    {order.date}
                                                </Typography>
                                            </Box>
                                        </ListItem>
                                        <Divider component="li" />
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Cảnh báo kho hàng */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', height: '100%' }}>
                        <CardHeader
                            title="Cảnh báo kho hàng"
                            action={
                                <Chip
                                    icon={<InventoryIcon />}
                                    label="Quản lý kho"
                                    clickable
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                />
                            }
                        />
                        <Divider />
                        <CardContent sx={{ p: 0 }}>
                            <List>
                                {inventoryAlerts.map((alert) => (
                                    <React.Fragment key={alert.id}>
                                        <ListItem>
                                            <ListItemIcon>
                                                {alert.status === 'OUT_OF_STOCK' ?
                                                    <WarningIcon color="error" /> :
                                                    <WarningIcon color="warning" />
                                                }
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={alert.product}
                                                secondary={alert.status === 'OUT_OF_STOCK' ? 'Hết hàng' : `Còn ${alert.quantity} sản phẩm`}
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tài xế đang hoạt động */}
                <Grid item xs={12}>
                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardHeader
                            title="Tài xế đang hoạt động"
                            action={
                                <Chip
                                    icon={<LocalShippingIcon />}
                                    label="Quản lý tài xế"
                                    clickable
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                />
                            }
                        />
                        <Divider />
                        <CardContent sx={{ p: 0 }}>
                            <Grid container>
                                {activeDrivers.map((driver) => (
                                    <Grid item xs={12} sm={6} md={3} key={driver.id}>
                                        <Box sx={{ p: 2, m: 1, borderRadius: 2, bgcolor: 'background.paper', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <PersonIcon sx={{ mr: 1, color: driver.status === 'ACTIVE' ? 'success.main' : 'warning.main' }} />
                                                <Typography variant="body1" fontWeight="medium">
                                                    {driver.name}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Đơn hàng
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {driver.orders} đơn
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    size="small"
                                                    icon={driver.status === 'ACTIVE' ? <CheckCircleIcon /> : <ScheduleIcon />}
                                                    label={driver.status === 'ACTIVE' ? 'Đang hoạt động' : 'Đang nghỉ'}
                                                    color={driver.status === 'ACTIVE' ? 'success' : 'warning'}
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box >
    );
};

export default ManagerDashboard;