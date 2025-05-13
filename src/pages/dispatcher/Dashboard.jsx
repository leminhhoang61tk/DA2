import React, { useState } from 'react';
import {
    Grid, Typography, Paper, Box, Card, CardContent, CardHeader, Divider,
    List, ListItem, ListItemText, ListItemIcon, Chip, Button, Avatar,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Badge
} from '@mui/material';
import {
    Assignment as AssignmentIcon,
    LocalShipping as LocalShippingIcon,
    Refresh as RefreshIcon,
    LocationOn as LocationOnIcon,
    Phone as PhoneIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    MoreVert as MoreVertIcon,
    FilterList as FilterListIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const DispatcherDashboard = () => {
    const { user } = useAuth();
    const [lastRefreshed, setLastRefreshed] = useState(new Date());

    // Dữ liệu đơn hàng đang chờ xử lý
    const pendingOrders = [
        {
            id: 'ORD-2025-0015',
            customer: 'Công ty TNHH ABC',
            address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
            items: 3,
            priority: 'HIGH',
            createdAt: '24/04/2025 08:30'
        },
        {
            id: 'ORD-2025-0014',
            customer: 'Nguyễn Văn X',
            address: '456 Lê Văn Lương, Quận 7, TP.HCM',
            items: 1,
            priority: 'NORMAL',
            createdAt: '24/04/2025 08:15'
        },
        {
            id: 'ORD-2025-0013',
            customer: 'Công ty CP XYZ',
            address: '789 Nguyễn Thị Thập, Quận 7, TP.HCM',
            items: 5,
            priority: 'HIGH',
            createdAt: '24/04/2025 08:00'
        },
        {
            id: 'ORD-2025-0012',
            customer: 'Trần Thị Y',
            address: '101 Nguyễn Hữu Thọ, Quận 7, TP.HCM',
            items: 2,
            priority: 'NORMAL',
            createdAt: '24/04/2025 07:45'
        },
    ];

    // Dữ liệu tài xế sẵn sàng
    const availableDrivers = [
        {
            id: 1,
            name: 'Nguyễn Văn A',
            phone: '0912345678',
            vehicle: '51F-12345',
            vehicleType: 'Xe tải nhỏ',
            status: 'AVAILABLE',
            currentLocation: 'Quận 7, TP.HCM',
            lastDelivery: '24/04/2025 07:30'
        },
        {
            id: 2,
            name: 'Trần Văn B',
            phone: '0923456789',
            vehicle: '51F-23456',
            vehicleType: 'Xe máy',
            status: 'AVAILABLE',
            currentLocation: 'Quận 7, TP.HCM',
            lastDelivery: '24/04/2025 08:00'
        },
        {
            id: 3,
            name: 'Lê Thị C',
            phone: '0934567890',
            vehicle: '51F-34567',
            vehicleType: 'Xe tải nhỏ',
            status: 'AVAILABLE',
            currentLocation: 'Quận 4, TP.HCM',
            lastDelivery: '24/04/2025 07:15'
        },
    ];

    // Dữ liệu đơn hàng đang giao
    const inTransitOrders = [
        {
            id: 'ORD-2025-0011',
            customer: 'Công ty TNHH DEF',
            driver: 'Phạm Văn D',
            status: 'IN_TRANSIT',
            estimatedDelivery: '24/04/2025 10:30',
            startTime: '24/04/2025 09:15'
        },
        {
            id: 'ORD-2025-0010',
            customer: 'Lê Văn Z',
            driver: 'Hoàng Văn E',
            status: 'IN_TRANSIT',
            estimatedDelivery: '24/04/2025 11:00',
            startTime: '24/04/2025 09:00'
        },
        {
            id: 'ORD-2025-0009',
            customer: 'Công ty CP GHI',
            driver: 'Ngô Thị F',
            status: 'IN_TRANSIT',
            estimatedDelivery: '24/04/2025 10:45',
            startTime: '24/04/2025 08:45'
        },
    ];

    // Hàm refresh dữ liệu
    const handleRefresh = () => {
        setLastRefreshed(new Date());
        // Trong thực tế sẽ gọi API để lấy dữ liệu mới
    };

    // Render chip ưu tiên
    const renderPriorityChip = (priority) => {
        switch (priority) {
            case 'HIGH':
                return <Chip size="small" label="Cao" color="error" />;
            case 'NORMAL':
                return <Chip size="small" label="Thường" color="primary" />;
            case 'LOW':
                return <Chip size="small" label="Thấp" color="success" />;
            default:
                return <Chip size="small" label={priority} />;
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Xin chào, {user.name}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Bảng điều khiển Điều phối viên - Quản lý đơn hàng và tài xế
                    </Typography>
                </Box>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleRefresh}
                    >
                        Làm mới
                    </Button>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5, textAlign: 'right' }}>
                        Cập nhật lần cuối: {lastRefreshed.toLocaleTimeString()}
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Đơn hàng đang chờ xử lý */}
                <Grid item xs={12} lg={6}>
                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', height: '100%' }}>
                        <CardHeader
                            title={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="h6">Đơn hàng chờ xử lý</Typography>
                                    <Badge badgeContent={pendingOrders.length} color="error" sx={{ ml: 1 }} />
                                </Box>
                            }
                            action={
                                <Box>
                                    <IconButton size="small">
                                        <FilterListIcon />
                                    </IconButton>
                                    <IconButton size="small">
                                        <MoreVertIcon />
                                    </IconButton>
                                </Box>
                            }
                        />
                        <Divider />
                        <CardContent sx={{ p: 0 }}>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Mã đơn</TableCell>
                                            <TableCell>Khách hàng</TableCell>
                                            <TableCell>Địa chỉ</TableCell>
                                            <TableCell align="center">SL</TableCell>
                                            <TableCell align="center">Ưu tiên</TableCell>
                                            <TableCell align="right">Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pendingOrders.map((order) => (
                                            <TableRow key={order.id} hover>
                                                <TableCell>{order.id}</TableCell>
                                                <TableCell>{order.customer}</TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                                                        {order.address}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">{order.items}</TableCell>
                                                <TableCell align="center">{renderPriorityChip(order.priority)}</TableCell>
                                                <TableCell align="right">
                                                    <Button size="small" variant="contained" color="primary">
                                                        Phân công
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tài xế sẵn sàng */}
                <Grid item xs={12} lg={6}>
                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', height: '100%' }}>
                        <CardHeader
                            title={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="h6">Tài xế sẵn sàng</Typography>
                                    <Badge badgeContent={availableDrivers.length} color="success" sx={{ ml: 1 }} />
                                </Box>
                            }
                            action={
                                <Box>
                                    <IconButton size="small">
                                        <FilterListIcon />
                                    </IconButton>
                                    <IconButton size="small">
                                        <MoreVertIcon />
                                    </IconButton>
                                </Box>
                            }
                        />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={2}>
                                {availableDrivers.map((driver) => (
                                    <Grid item xs={12} key={driver.id}>
                                        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item>
                                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                        {driver.name.charAt(0)}
                                                    </Avatar>
                                                </Grid>
                                                <Grid item xs>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {driver.name}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                                            <LocalShippingIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                            {driver.vehicle} ({driver.vehicleType})
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                            {driver.currentLocation}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Chip
                                                            size="small"
                                                            icon={<CheckCircleIcon />}
                                                            label="Sẵn sàng"
                                                            color="success"
                                                            sx={{ mr: 1 }}
                                                        />
                                                        <IconButton size="small" color="primary">
                                                            <PhoneIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Đơn hàng đang giao */}
                <Grid item xs={12}>
                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardHeader
                            title={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="h6">Đơn hàng đang giao</Typography>
                                    <Badge badgeContent={inTransitOrders.length} color="primary" sx={{ ml: 1 }} />
                                </Box>
                            }
                            action={
                                <Box>
                                    <IconButton size="small">
                                        <FilterListIcon />
                                    </IconButton>
                                    <IconButton size="small">
                                        <MoreVertIcon />
                                    </IconButton>
                                </Box>
                            }
                        />
                        <Divider />
                        <CardContent sx={{ p: 0 }}>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Mã đơn</TableCell>
                                            <TableCell>Khách hàng</TableCell>
                                            <TableCell>Tài xế</TableCell>
                                            <TableCell>Trạng thái</TableCell>
                                            <TableCell>Bắt đầu</TableCell>
                                            <TableCell>Dự kiến giao</TableCell>
                                            <TableCell align="right">Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {inTransitOrders.map((order) => (
                                            <TableRow key={order.id} hover>
                                                <TableCell>{order.id}</TableCell>
                                                <TableCell>{order.customer}</TableCell>
                                                <TableCell>{order.driver}</TableCell>
                                                <TableCell>
                                                    <Chip size="small" label="Đang giao" color="primary" />
                                                </TableCell>
                                                <TableCell>{order.startTime}</TableCell>
                                                <TableCell>{order.estimatedDelivery}</TableCell>
                                                <TableCell align="right">
                                                    <Button size="small" variant="outlined">
                                                        Chi tiết
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DispatcherDashboard;