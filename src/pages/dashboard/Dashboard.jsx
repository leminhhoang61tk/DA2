import React from 'react';
import {
    Grid,
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    useTheme
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    ShoppingCart as ShoppingCartIcon,
    LocalShipping as LocalShippingIcon,
    AttachMoney as AttachMoneyIcon,
    PeopleAlt as PeopleAltIcon,
    Inventory as InventoryIcon,
    AccessTime as AccessTimeIcon,
    CheckCircle as CheckCircleIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Import mock data
import { dashboardStats, revenueData, orderStatusData, deliveryPerformance, topDrivers, topCustomers } from '../../mockData/analytics';
import { orders } from '../../mockData/orders';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Stat Card Component
const StatCard = ({ icon, title, value, trend, trendValue, color }) => {
    const theme = useTheme();

    return (
        <Card sx={{ height: '100%', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        sx={{
                            backgroundColor: `${color}.light`,
                            color: `${color}.main`,
                            width: 56,
                            height: 56,
                        }}
                    >
                        {icon}
                    </Avatar>
                    <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                            {value}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {trend === 'up' ? (
                        <TrendingUpIcon sx={{ color: theme.palette.success.main, mr: 0.5, fontSize: 16 }} />
                    ) : (
                        <TrendingDownIcon sx={{ color: theme.palette.error.main, mr: 0.5, fontSize: 16 }} />
                    )}
                    <Typography
                        variant="body2"
                        color={trend === 'up' ? 'success.main' : 'error.main'}
                        fontWeight="medium"
                    >
                        {trendValue}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                        so với tháng trước
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

const Dashboard = () => {
    const theme = useTheme();

    // Format recent orders
    const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    // Chart options
    const revenueChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        maintainAspectRatio: false,
    };

    const orderStatusChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: false,
            },
        },
        maintainAspectRatio: false,
    };

    const deliveryPerformanceOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: false,
                min: 90,
                max: 100,
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                beginAtZero: false,
                min: 20,
                max: 35,
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Xin chào, Admin! Đây là tổng quan về hệ thống SmartShipD.
                </Typography>
            </Box>

            {/* Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<ShoppingCartIcon />}
                        title="Tổng đơn hàng"
                        value={dashboardStats.totalOrders.toLocaleString()}
                        trend="up"
                        trendValue="+8.5%"
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<AttachMoneyIcon />}
                        title="Doanh thu"
                        value={`${(dashboardStats.totalRevenue / 1000000000).toFixed(2)} tỷ`}
                        trend="up"
                        trendValue="+12.3%"
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<LocalShippingIcon />}
                        title="Tài xế hoạt động"
                        value={dashboardStats.activeDrivers}
                        trend="up"
                        trendValue="+2"
                        color="info"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<AccessTimeIcon />}
                        title="Thời gian giao hàng TB"
                        value={`${dashboardStats.avgDeliveryTime} giờ`}
                        trend="down"
                        trendValue="-5.2%"
                        color="warning"
                    />
                </Grid>
            </Grid>

            {/* Charts & Tables */}
            <Grid container spacing={3}>
                {/* Revenue Chart */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader
                            title="Doanh thu theo tháng"
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                        />
                        <Divider />
                        <CardContent>
                            <Box sx={{ height: 300 }}>
                                <Line options={revenueChartOptions} data={revenueData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Order Status Chart */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader
                            title="Trạng thái đơn hàng"
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                        />
                        <Divider />
                        <CardContent>
                            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                                <Doughnut options={orderStatusChartOptions} data={orderStatusData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Orders */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader
                            title="Đơn hàng gần đây"
                            action={
                                <Button
                                    size="small"
                                    startIcon={<RefreshIcon />}
                                    onClick={() => { }}
                                >
                                    Làm mới
                                </Button>
                            }
                        />
                        <Divider />
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mã đơn</TableCell>
                                        <TableCell>Khách hàng</TableCell>
                                        <TableCell>Ngày tạo</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell align="right">Giá trị</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentOrders.map((order) => (
                                        <TableRow key={order.id} hover>
                                            <TableCell>{order.orderNumber}</TableCell>
                                            <TableCell>{order.customerName}</TableCell>
                                            <TableCell>
                                                {format(new Date(order.createdAt), 'dd/MM/yyyy', { locale: vi })}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={
                                                        order.status === 'DELIVERED'
                                                            ? 'Đã giao'
                                                            : order.status === 'IN_TRANSIT'
                                                                ? 'Đang vận chuyển'
                                                                : order.status === 'PROCESSING'
                                                                    ? 'Đang xử lý'
                                                                    : order.status === 'PENDING'
                                                                        ? 'Chờ xử lý'
                                                                        : 'Đã hủy'
                                                    }
                                                    color={
                                                        order.status === 'DELIVERED'
                                                            ? 'success'
                                                            : order.status === 'IN_TRANSIT'
                                                                ? 'info'
                                                                : order.status === 'PROCESSING'
                                                                    ? 'warning'
                                                                    : order.status === 'PENDING'
                                                                        ? 'default'
                                                                        : 'error'
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                {order.totalAmount.toLocaleString()} đ
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Button variant="text" color="primary">
                                Xem tất cả đơn hàng
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                {/* Top Drivers */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader
                            title="Tài xế hiệu suất cao"
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                        />
                        <Divider />
                        <List>
                            {topDrivers.map((driver) => (
                                <React.Fragment key={driver.id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar>{driver.name.charAt(0)}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={driver.name}
                                            secondary={
                                                <React.Fragment>
                                                    <Box sx={{ display: 'flex', mt: 1 }}>
                                                        <Box sx={{ mr: 2 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Đơn giao
                                                            </Typography>
                                                            <Typography variant="body1" fontWeight="medium">
                                                                {driver.deliveries}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ mr: 2 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Tỷ lệ đúng hẹn
                                                            </Typography>
                                                            <Typography variant="body1" fontWeight="medium">
                                                                {driver.onTimeRate}%
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Đánh giá
                                                            </Typography>
                                                            <Typography variant="body1" fontWeight="medium">
                                                                {driver.rating}/5
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    {driver.id !== topDrivers[topDrivers.length - 1].id && <Divider variant="inset" component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Button variant="text" color="primary">Xem tất cả tài xế
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                {/* Delivery Performance */}
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title="Hiệu suất giao hàng"
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                        />
                        <Divider />
                        <CardContent>
                            <Box sx={{ height: 300 }}>
                                <Line options={deliveryPerformanceOptions} data={deliveryPerformance} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Top Customers */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader
                            title="Khách hàng hàng đầu"
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                        />
                        <Divider />
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Khách hàng</TableCell>
                                        <TableCell align="right">Đơn hàng</TableCell>
                                        <TableCell align="right">Tổng chi tiêu</TableCell>
                                        <TableCell align="right">Đơn gần nhất</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {topCustomers.map((customer) => (
                                        <TableRow key={customer.id} hover>
                                            <TableCell>{customer.name}</TableCell>
                                            <TableCell align="right">{customer.orders}</TableCell>
                                            <TableCell align="right">
                                                {customer.totalSpent.toLocaleString()} đ
                                            </TableCell>
                                            <TableCell align="right">
                                                {format(new Date(customer.lastOrder), 'dd/MM/yyyy', { locale: vi })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Button variant="text" color="primary">
                                Xem tất cả khách hàng
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader
                            title="Tóm tắt đơn hàng hôm nay"
                            subheader={`Ngày ${format(new Date(), 'dd/MM/yyyy', { locale: vi })}`}
                            action={
                                <Button
                                    size="small"
                                    startIcon={<RefreshIcon />}
                                    onClick={() => { }}
                                >
                                    Làm mới
                                </Button>
                            }
                        />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={6} md={3}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                                            {dashboardStats.ordersToday}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Tổng đơn
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" fontWeight="bold" color="success.main">
                                            12
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Đã giao
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" fontWeight="bold" color="info.main">
                                            20
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Đang giao
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" fontWeight="bold" color="warning.main">
                                            16
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Chờ xử lý
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Phân bổ theo khu vực
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">TP.HCM</Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                28
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">Bình Dương</Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                8
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">Đồng Nai</Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                6
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">Long An</Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                3
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">Vũng Tàu</Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                2
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">Khác</Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                1
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Doanh thu hôm nay
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" color="success.main">
                                    {dashboardStats.revenueToday.toLocaleString()} đ
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <TrendingUpIcon sx={{ color: theme.palette.success.main, mr: 0.5, fontSize: 16 }} />
                                    <Typography variant="body2" color="success.main" fontWeight="medium">
                                        +15.2%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                                        so với hôm qua
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;