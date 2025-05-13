import React, { useState } from 'react';
import {
    Grid, Typography, Paper, Box, Card, CardContent, CardHeader, Divider,
    List, ListItem, ListItemText, ListItemIcon, Chip, Button, Avatar,
    Stepper, Step, StepLabel, StepContent, IconButton, Badge
} from '@mui/material';
import {
    Assignment as AssignmentIcon,
    DirectionsCar as DirectionsCarIcon,
    Phone as PhoneIcon,
    LocationOn as LocationOnIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    LocalShipping as LocalShippingIcon,
    Inventory as InventoryIcon,
    Receipt as ReceiptIcon,
    CreditCard as CreditCardIcon,
    Navigation as NavigationIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const DriverDashboard = () => {
    const { user } = useAuth();
    const [activeStep, setActiveStep] = useState(1);

    // Dữ liệu đơn hàng hiện tại
    const currentOrder = {
        id: 'ORD-2025-0011',
        customer: {
            name: 'Công ty TNHH DEF',
            address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
            phone: '0901234567',
            contactPerson: 'Nguyễn Văn X'
        },
        items: [
            { id: 1, name: 'Laptop Dell XPS 13', quantity: 1 },
            { id: 2, name: 'Chuột không dây Logitech', quantity: 2 },
            { id: 3, name: 'Bàn phím cơ Keychron', quantity: 1 }
        ],
        status: 'IN_TRANSIT',
        paymentMethod: 'COD',
        paymentAmount: 25000000,
        estimatedDelivery: '24/04/2025 10:30',
        startTime: '24/04/2025 09:15',
        notes: 'Gọi trước khi giao 30 phút'
    };

    // Dữ liệu đơn hàng tiếp theo
    const nextOrders = [
        {
            id: 'ORD-2025-0012',
            customer: 'Trần Thị Y',
            address: '456 Lê Văn Lương, Quận 7, TP.HCM',
            estimatedDelivery: '24/04/2025 11:30',
            items: 2
        },
        {
            id: 'ORD-2025-0013',
            customer: 'Công ty CP XYZ',
            address: '789 Nguyễn Thị Thập, Quận 7, TP.HCM',
            estimatedDelivery: '24/04/2025 13:00',
            items: 5
        },
    ];

    // Dữ liệu đơn hàng đã hoàn thành
    const completedOrders = [
        {
            id: 'ORD-2025-0010',
            customer: 'Lê Văn Z',
            status: 'DELIVERED',
            completedAt: '24/04/2025 08:45'
        },
        {
            id: 'ORD-2025-0009',
            customer: 'Công ty CP GHI',
            status: 'DELIVERED',
            completedAt: '24/04/2025 08:15'
        },
    ];

    // Các bước giao hàng
    const deliverySteps = [
        {
            label: 'Nhận đơn hàng',
            description: 'Đơn hàng đã được nhận lúc 09:15',
            completed: true
        },
        {
            label: 'Đang giao hàng',
            description: 'Đang trên đường đến địa chỉ giao hàng',
            completed: false
        },
        {
            label: 'Đã đến nơi',
            description: 'Đã đến địa điểm giao hàng',
            completed: false
        },
        {
            label: 'Giao hàng thành công',
            description: 'Khách hàng đã nhận hàng và thanh toán',
            completed: false
        },
    ];

    // Xử lý cập nhật trạng thái
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Xin chào, {user.name}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Bảng điều khiển Tài xế - Quản lý giao hàng
                    </Typography>
                </Box>
                <Box>
                    <Chip
                        icon={<CheckCircleIcon />}
                        label="Đang làm việc"
                        color="success"
                        variant="outlined"
                    />
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Đơn hàng hiện tại */}
                <Grid item xs={12}>
                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardHeader
                            title="Đơn hàng hiện tại"
                            subheader={`Mã đơn: ${currentOrder.id}`}
                            action={
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<NavigationIcon />}
                                >
                                    Chỉ đường
                                </Button>
                            }
                        />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                        Thông tin khách hàng
                                    </Typography>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                                        <Typography variant="body1" fontWeight="medium">
                                            {currentOrder.customer.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Người liên hệ: {currentOrder.customer.contactPerson}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                            <Typography variant="body2">{currentOrder.customer.phone}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
                                            <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'error.main', mt: 0.3 }} />
                                            <Typography variant="body2">{currentOrder.customer.address}</Typography>
                                        </Box>
                                        <Box sx={{ mt: 2 }}>
                                            <Button variant="outlined" size="small" startIcon={<PhoneIcon />}>
                                                Gọi điện
                                            </Button>
                                        </Box>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                        Thông tin đơn hàng
                                    </Typography>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <InventoryIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                            <Typography variant="body2" fontWeight="medium">
                                                Danh sách sản phẩm ({currentOrder.items.length})
                                            </Typography>
                                        </Box>
                                        <List dense disablePadding>
                                            {currentOrder.items.map((item) => (
                                                <ListItem key={item.id} disablePadding sx={{ py: 0.5 }}>
                                                    <ListItemText
                                                        primary={item.name}
                                                        secondary={`Số lượng: ${item.quantity}`}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                        <Divider sx={{ my: 1.5 }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <ReceiptIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                                            <Typography variant="body2">
                                                Ghi chú: {currentOrder.notes}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CreditCardIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                                            <Typography variant="body2">
                                                Thanh toán: {currentOrder.paymentMethod === 'COD' ? 'Tiền mặt khi nhận hàng' : 'Đã thanh toán'}
                                            </Typography>
                                        </Box>
                                        {currentOrder.paymentMethod === 'COD' && (
                                            <Typography variant="body1" fontWeight="medium" color="error" sx={{ mt: 1 }}>
                                                Số tiền cần thu: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentOrder.paymentAmount)}
                                            </Typography>
                                        )}
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                        Trạng thái giao hàng
                                    </Typography>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                                        <Stepper activeStep={activeStep} orientation="vertical">
                                            {deliverySteps.map((step, index) => (
                                                <Step key={step.label} completed={index < activeStep}>
                                                    <StepLabel>{step.label}</StepLabel>
                                                    <StepContent>
                                                        <Typography variant="body2">{step.description}</Typography>
                                                        {index === activeStep && (
                                                            <Box sx={{ mt: 2 }}>
                                                                <Button
                                                                    variant="contained"
                                                                    onClick={handleNext}
                                                                    sx={{ mt: 1, mr: 1 }}
                                                                >
                                                                    {index === deliverySteps.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
                                                                </Button>
                                                            </Box>
                                                        )}
                                                    </StepContent>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Đơn hàng tiếp theo */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', height: '100%' }}>
                        <CardHeader
                            title={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="h6">Đơn hàng tiếp theo</Typography>
                                    <Badge badgeContent={nextOrders.length} color="primary" sx={{ ml: 1 }} />
                                </Box>
                            }
                        />
                        <Divider />
                        <CardContent>
                            {nextOrders.length > 0 ? (
                                <List>
                                    {nextOrders.map((order) => (
                                        <React.Fragment key={order.id}>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <AssignmentIcon color="primary" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Typography variant="body1" fontWeight="medium">
                                                                {order.id}
                                                            </Typography>
                                                            <Chip
                                                                size="small"
                                                                label={`${order.items} sản phẩm`}
                                                                color="primary"
                                                                variant="outlined"
                                                                sx={{ ml: 1 }}
                                                            />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography variant="body2">{order.customer}</Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {order.address}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Dự kiến: {order.estimatedDelivery}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider component="li" />
                                        </React.Fragment>
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Không có đơn hàng tiếp theo
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Đơn hàng đã hoàn thành */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', height: '100%' }}>
                        <CardHeader
                            title="Đơn hàng đã hoàn thành hôm nay"
                            action={
                                <Chip
                                    icon={<CheckCircleIcon />}
                                    label={`${completedOrders.length} đơn`}
                                    color="success"
                                    variant="outlined"
                                />
                            }
                        />
                        <Divider />
                        <CardContent>
                            {completedOrders.length > 0 ? (
                                <List>
                                    {completedOrders.map((order) => (
                                        <React.Fragment key={order.id}>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <CheckCircleIcon color="success" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={order.id}
                                                    secondary={
                                                        <>
                                                            <Typography variant="body2">{order.customer}</Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Hoàn thành lúc: {order.completedAt}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider component="li" />
                                        </React.Fragment>
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Chưa có đơn hàng nào hoàn thành hôm nay
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Thông tin tài xế */}
                <Grid item xs={12}>
                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                        <CardHeader title="Thông tin tài xế" />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <DirectionsCarIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            <Typography variant="body1" fontWeight="medium">
                                                Phương tiện
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2">
                                            Biển số: 51F-12345
                                        </Typography>
                                        <Typography variant="body2">
                                            Loại xe: Xe tải nhỏ
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <AssignmentIcon sx={{ mr: 1, color: 'info.main' }} />
                                            <Typography variant="body1" fontWeight="medium">
                                                Đơn hàng hôm nay
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2">
                                            Đã hoàn thành: {completedOrders.length}
                                        </Typography>
                                        <Typography variant="body2">
                                            Đang giao: 1
                                        </Typography>
                                        <Typography variant="body2">
                                            Còn lại: {nextOrders.length}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <ScheduleIcon sx={{ mr: 1, color: 'warning.main' }} />
                                            <Typography variant="body1" fontWeight="medium">
                                                Thời gian làm việc
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2">
                                            Bắt đầu: 08:00
                                        </Typography>
                                        <Typography variant="body2">
                                            Kết thúc dự kiến: 17:00
                                        </Typography>
                                        <Typography variant="body2">
                                            Thời gian làm việc: 3h 30p
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <LocalShippingIcon sx={{ mr: 1, color: 'success.main' }} />
                                            <Typography variant="body1" fontWeight="medium">
                                                Tổng quãng đường
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2">
                                            Hôm nay: 25.5 km
                                        </Typography>
                                        <Typography variant="body2">
                                            Tuần này: 120.3 km
                                        </Typography>
                                        <Typography variant="body2">
                                            Tháng này: 520.7 km
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DriverDashboard;