import React from 'react';
import { 
  Grid, Typography, Paper, Box, Card, CardContent, CardHeader, Divider, 
  List, ListItem, ListItemText, ListItemIcon, Chip, Button, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton
} from '@mui/material';
import { 
  Assignment as AssignmentIcon, 
  ShoppingCart as ShoppingCartIcon,
  History as HistoryIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  AddCircle as AddCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();

  // Dữ liệu đơn hàng đang xử lý
  const activeOrders = [
    { 
      id: 'ORD-2025-0020', 
      orderDate: '23/04/2025',
      items: 3,
      total: 5200000,
      status: 'PROCESSING',
      estimatedDelivery: '25/04/2025'
    },
    { 
      id: 'ORD-2025-0018', 
      orderDate: '22/04/2025',
      items: 1,
      total: 1500000,
      status: 'IN_TRANSIT',
      estimatedDelivery: '24/04/2025'
    },
  ];

  // Dữ liệu lịch sử đơn hàng
  const orderHistory = [
    { 
      id: 'ORD-2025-0015', 
      orderDate: '20/04/2025',
      items: 2,
      total: 3500000,
      status: 'DELIVERED',
      deliveryDate: '21/04/2025'
    },
    { 
      id: 'ORD-2025-0012', 
      orderDate: '15/04/2025',
      items: 4,
      total: 7800000,
      status: 'DELIVERED',
      deliveryDate: '17/04/2025'
    },
    { 
      id: 'ORD-2025-0010', 
      orderDate: '10/04/2025',
      items: 1,
      total: 2200000,
      status: 'DELIVERED',
      deliveryDate: '12/04/2025'
    },
  ];

  // Dữ liệu địa chỉ giao hàng
  const deliveryAddresses = [
    {
      id: 1,
      name: 'Văn phòng',
      address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
      phone: '0901234567',
      isDefault: true
    },
    {
      id: 2,
      name: 'Nhà riêng',
      address: '456 Lê Văn Lương, Quận 7, TP.HCM',
      phone: '0912345678',
      isDefault: false
    },
  ];

  // Render trạng thái đơn hàng
  const renderOrderStatus = (status) => {
    switch (status) {
      case 'PROCESSING':
        return <Chip size="small" label="Đang xử lý" color="warning" />;
      case 'IN_TRANSIT':
        return <Chip size="small" label="Đang giao" color="primary" />;
      case 'DELIVERED':
        return <Chip size="small" label="Đã giao" color="success" />;
      case 'CANCELLED':
        return <Chip size="small" label="Đã hủy" color="error" />;
      default:
        return <Chip size="small" label={status} />;
    }
  };

  // Format tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Xin chào, {user.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Chào mừng đến với Bảng điều khiển Khách hàng. Quản lý đơn hàng và thông tin giao hàng của bạn.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Thẻ tổng quan */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 2 }}>
                    <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{activeOrders.length}</Typography>
                    <Typography variant="body2" color="text.secondary">Đơn hàng đang xử lý</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 2 }}>
                    <HistoryIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{orderHistory.length}</Typography>
                    <Typography variant="body2" color="text.secondary">Đơn hàng đã hoàn thành</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 2 }}>
                    <LocationOnIcon sx={{ fontSize: 40, color: 'info.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{deliveryAddresses.length}</Typography>
                    <Typography variant="body2" color="text.secondary">Địa chỉ giao hàng</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                  },
                }}
              >
                <ShoppingCartIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body1" fontWeight="medium">Tạo đơn hàng mới</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Đơn hàng đang xử lý */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
            <CardHeader 
              title="Đơn hàng đang xử lý" 
              action={
                <Button 
                  variant="text" 
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => {/* Xử lý chuyển trang */}}
                >
                  Xem tất cả
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              {activeOrders.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã đơn hàng</TableCell>
                        <TableCell>Ngày đặt</TableCell>
                        <TableCell align="center">Số lượng</TableCell>
                        <TableCell align="right">Tổng tiền</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Dự kiến giao</TableCell>
                        <TableCell align="right">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeOrders.map((order) => (
                        <TableRow key={order.id} hover>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.orderDate}</TableCell>
                          <TableCell align="center">{order.items}</TableCell>
                          <TableCell align="right">{formatCurrency(order.total)}</TableCell>
                          <TableCell>{renderOrderStatus(order.status)}</TableCell>
                          <TableCell>{order.estimatedDelivery}</TableCell>
                          <TableCell align="right">
                            <IconButton size="small" color="primary">
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Không có đơn hàng đang xử lý
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<AddCircleIcon />}
                    sx={{ mt: 2 }}
                  >
                    Tạo đơn hàng mới
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Địa chỉ giao hàng */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', height: '100%' }}>
            <CardHeader 
              title="Địa chỉ giao hàng" 
              action={
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<AddCircleIcon />}
                >
                  Thêm địa chỉ
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {deliveryAddresses.map((address) => (
                  <Grid item xs={12} key={address.id}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        border: '1px solid', 
                        borderColor: address.isDefault ? 'primary.main' : 'divider',
                        position: 'relative'
                      }}
                    >
                      {address.isDefault && (
                        <Chip 
                          label="Mặc định" 
                          color="primary" 
                          size="small" 
                          sx={{ 
                            position: 'absolute', 
                            top: -10, 
                            right: 10 
                          }} 
                        />
                      )}
                      <Typography variant="body1" fontWeight="medium">
                        {address.name}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {address.address}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {address.phone}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button size="small" sx={{ mr: 1 }}>Chỉnh sửa</Button>
                        {!address.isDefault && (
                          <Button size="small" color="primary">Đặt làm mặc định</Button>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Lịch sử đơn hàng */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', height: '100%' }}>
            <CardHeader 
              title="Lịch sử đơn hàng" 
              action={
                <Button 
                  variant="text" 
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => {/* Xử lý chuyển trang */}}
                >
                  Xem tất cả
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List>
                {orderHistory.map((order) => (
                  <React.Fragment key={order.id}>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" size="small">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <AssignmentIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="medium">
                              {order.id}
                            </Typography>
                            {renderOrderStatus(order.status)}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              Ngày đặt: {order.orderDate} | Ngày giao: {order.deliveryDate}
                            </Typography>
                            <Typography variant="body2">
                              {order.items} sản phẩm | {formatCurrency(order.total)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Thông tin tài khoản */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
            <CardHeader 
              title="Thông tin tài khoản" 
              action={
                <Button variant="outlined" size="small">
                  Cập nhật
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{ width: 64, height: 64, mr: 2 }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Khách hàng
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{user.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Số điện thoại</Typography>
                      <Typography variant="body1">{user.phone || '0945678901'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Ngày tham gia</Typography>
                      <Typography variant="body1">{user.joinDate || '20/05/2023'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Tổng số đơn hàng</Typography>
                      <Typography variant="body1">{activeOrders.length + orderHistory.length}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerDashboard;