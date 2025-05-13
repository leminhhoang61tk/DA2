import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocalShipping } from '@mui/icons-material';

const AuthLayoutRoot = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    minHeight: '100vh',
}));

const AuthLayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    alignItems: 'center',
    justifyContent: 'center',
});

const AuthLayout = () => {
    return (
        <AuthLayoutRoot>
            <AuthLayoutContainer>
                <Container maxWidth="sm">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 4,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LocalShipping sx={{ color: 'primary.main', mr: 1, fontSize: 40 }} />
                            <Typography variant="h4" fontWeight="bold" color="primary">
                                SmartShipD
                            </Typography>
                        </Box>
                        <Typography variant="body1" color="text.secondary" textAlign="center">
                            Hệ thống quản lý vận chuyển và giao hàng thông minh
                        </Typography>
                    </Box>
                    <Outlet />
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            © 2025 SmartShipD. Bản quyền thuộc về Công ty TNHH Công nghệ SmartShipD.
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            <Link href="#" underline="hover" color="inherit" sx={{ mx: 1 }}>
                                <Typography variant="body2">Điều khoản sử dụng</Typography>
                            </Link>
                            <Link href="#" underline="hover" color="inherit" sx={{ mx: 1 }}>
                                <Typography variant="body2">Chính sách bảo mật</Typography>
                            </Link>
                            <Link href="#" underline="hover" color="inherit" sx={{ mx: 1 }}>
                                <Typography variant="body2">Trợ giúp</Typography>
                            </Link>
                        </Box>
                    </Box>
                </Container>
            </AuthLayoutContainer>
        </AuthLayoutRoot>
    );
};

export default AuthLayout;