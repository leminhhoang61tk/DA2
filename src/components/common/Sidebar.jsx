import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  History as HistoryIcon,
  LocationOn as LocationOnIcon,
  ExpandLess,
  ExpandMore,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  Map as MapIcon,
  Notifications as NotificationsIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import { useAuth, ROLES } from '../../context/AuthContext';

const Sidebar = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const location = useLocation();
  const { user } = useAuth();
  const [openMenus, setOpenMenus] = React.useState({});

  // Xử lý mở/đóng menu con
  const handleMenuToggle = (menuId) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menuId]: !prevState[menuId],
    }));
  };

  // Kiểm tra đường dẫn hiện tại
  const isActive = (path) => location.pathname === path;

  // Menu cho Admin
  const adminMenuItems = [
    {
      id: 'dashboard',
      label: 'Bảng điều khiển',
      icon: <DashboardIcon />,
      path: '/admin/dashboard',
    },
    {
      id: 'orders',
      label: 'Quản lý đơn hàng',
      icon: <AssignmentIcon />,
      path: '/admin/orders',
      children: [
        { label: 'Tất cả đơn hàng', path: '/admin/orders' },
        { label: 'Tạo đơn hàng', path: '/admin/orders/create' },
        { label: 'Báo cáo đơn hàng', path: '/admin/orders/reports' },
      ],
    },
    {
      id: 'customers',
      label: 'Quản lý khách hàng',
      icon: <PeopleIcon />,
      path: '/admin/customers',
    },
    {
      id: 'drivers',
      label: 'Quản lý tài xế',
      icon: <LocalShippingIcon />,
      path: '/admin/drivers',
    },
    {
      id: 'inventory',
      label: 'Quản lý kho hàng',
      icon: <InventoryIcon />,
      path: '/admin/inventory',
    },
    {
      id: 'analytics',
      label: 'Báo cáo thống kê',
      icon: <BarChartIcon />,
      path: '/admin/analytics',
    },
    {
      id: 'users',
      label: 'Quản lý người dùng',
      icon: <PersonIcon />,
      path: '/admin/users',
    },
    {
      id: 'settings',
      label: 'Cài đặt hệ thống',
      icon: <SettingsIcon />,
      path: '/admin/settings',
    },
  ];

  // Menu cho Manager
  const managerMenuItems = [
    {
      id: 'dashboard',
      label: 'Bảng điều khiển',
      icon: <DashboardIcon />,
      path: '/manager/dashboard',
    },
    {
      id: 'orders',
      label: 'Quản lý đơn hàng',
      icon: <AssignmentIcon />,
      path: '/manager/orders',
      children: [
        { label: 'Tất cả đơn hàng', path: '/manager/orders' },
        { label: 'Tạo đơn hàng', path: '/manager/orders/create' },
      ],
    },
    {
      id: 'customers',
      label: 'Quản lý khách hàng',
      icon: <PeopleIcon />,
      path: '/manager/customers',
    },
    {
      id: 'drivers',
      label: 'Quản lý tài xế',
      icon: <LocalShippingIcon />,
      path: '/manager/drivers',
    },
    {
      id: 'inventory',
      label: 'Quản lý kho hàng',
      icon: <InventoryIcon />,
      path: '/manager/inventory',
    },
    {
      id: 'analytics',
      label: 'Báo cáo thống kê',
      icon: <BarChartIcon />,
      path: '/manager/analytics',
    },
  ];

  // Menu cho Dispatcher
  const dispatcherMenuItems = [
    {
      id: 'dashboard',
      label: 'Bảng điều khiển',
      icon: <DashboardIcon />,
      path: '/dispatcher/dashboard',
    },
    {
      id: 'orders',
      label: 'Quản lý đơn hàng',
      icon: <AssignmentIcon />,
      path: '/dispatcher/orders',
    },
    {
      id: 'drivers',
      label: 'Quản lý tài xế',
      icon: <LocalShippingIcon />,
      path: '/dispatcher/drivers',
    },
    {
      id: 'routes',
      label: 'Lập kế hoạch tuyến',
      icon: <MapIcon />,
      path: '/dispatcher/routes',
    },
    {
      id: 'tracking',
      label: 'Theo dõi giao hàng',
      icon: <LocationOnIcon />,
      path: '/dispatcher/tracking',
    },
  ];

  // Menu cho Driver
  const driverMenuItems = [
    {
      id: 'dashboard',
      label: 'Bảng điều khiển',
      icon: <DashboardIcon />,
      path: '/driver/dashboard',
    },
    {
      id: 'orders',
      label: 'Đơn hàng của tôi',
      icon: <AssignmentIcon />,
      path: '/driver/orders',
    },
    {
      id: 'schedule',
      label: 'Lịch trình',
      icon: <ScheduleIcon />,
      path: '/driver/schedule',
    },
    {
      id: 'map',
      label: 'Bản đồ & Chỉ đường',
      icon: <MapIcon />,
      path: '/driver/map',
    },
    {
      id: 'history',
      label: 'Lịch sử giao hàng',
      icon: <HistoryIcon />,
      path: '/driver/history',
    },
  ];

  // Menu cho Customer
  const customerMenuItems = [
    {
      id: 'dashboard',
      label: 'Bảng điều khiển',
      icon: <DashboardIcon />,
      path: '/customer/dashboard',
    },
    {
      id: 'orders',
      label: 'Đơn hàng của tôi',
      icon: <AssignmentIcon />,
      path: '/customer/orders',
    },
    {
      id: 'create-order',
      label: 'Tạo đơn hàng mới',
      icon: <ShoppingCartIcon />,
      path: '/customer/orders/create',
    },
    {
      id: 'tracking',
      label: 'Theo dõi đơn hàng',
      icon: <LocationOnIcon />,
      path: '/customer/tracking',
    },
    {
      id: 'history',
      label: 'Lịch sử đơn hàng',
      icon: <HistoryIcon />,
      path: '/customer/history',
    },
    {
      id: 'profile',
      label: 'Thông tin cá nhân',
      icon: <PersonIcon />,
      path: '/customer/profile',
    },
  ];

  // Chọn menu dựa trên vai trò người dùng
  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case ROLES.ADMIN:
        return adminMenuItems;
      case ROLES.MANAGER:
        return managerMenuItems;
      case ROLES.DISPATCHER:
        return dispatcherMenuItems;
      case ROLES.DRIVER:
        return driverMenuItems;
      case ROLES.CUSTOMER:
        return customerMenuItems;
      default:
        return [];
    }
  };

  // Render menu item
  const renderMenuItem = (item) => (
    <React.Fragment key={item.id}>
      <ListItem disablePadding>
        {item.children ? (
          <>
            <ListItemButton
              onClick={() => handleMenuToggle(item.id)}
              sx={{
                backgroundColor: isActive(item.path) ? 'action.selected' : 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                pl: 2,
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  color: isActive(item.path) ? 'primary.main' : 'inherit',
                  fontWeight: isActive(item.path) ? 'medium' : 'regular',
                }}
              />
              {openMenus[item.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openMenus[item.id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map((child) => (
                  <ListItemButton
                    key={child.path}
                    component={RouterLink}
                    to={child.path}
                    sx={{
                      pl: 4,
                      backgroundColor: isActive(child.path) ? 'action.selected' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemText
                      primary={child.label}
                      primaryTypographyProps={{
                        color: isActive(child.path) ? 'primary.main' : 'inherit',
                        fontWeight: isActive(child.path) ? 'medium' : 'regular',
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </>
        ) : (
          <ListItemButton
            component={RouterLink}
            to={item.path}
            sx={{
              backgroundColor: isActive(item.path) ? 'action.selected' : 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              pl: 2,
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                color: isActive(item.path) ? 'primary.main' : 'inherit',
                fontWeight: isActive(item.path) ? 'medium' : 'regular',
              }}
            />
          </ListItemButton>
        )}
      </ListItem>
    </React.Fragment>
  );

  // Nội dung sidebar
  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          SmartShipD
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, overflow: 'auto', py: 2 }}>
        <List>
          {getMenuItems().map((item) => renderMenuItem(item))}
        </List>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/help"
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              pl: 2,
            }}
          >
            <ListItemIcon>
              <SupportIcon />
            </ListItemIcon>
            <ListItemText primary="Trợ giúp & Hỗ trợ" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: open ? 240 : 0 }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, borderRight: `1px solid ${theme.palette.divider}` },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;