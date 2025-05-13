import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Block } from '@mui/icons-material';

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 8,
                    textAlign: 'center',
                }}
            >
                <Block sx={{ fontSize: 100, color: 'error.main', mb: 4 }} />
                <Typography variant="h1" fontWeight="bold" color="text.primary" gutterBottom>
                    403
                </Typography>
                <Typography variant="h4" color="text.primary" gutterBottom>
                    Truy cập bị từ chối
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mb: 4 }}>
                    Bạn không có quyền truy cập vào trang này.
                    Vui lòng liên hệ với quản trị viên nếu bạn cho rằng đây là lỗi.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/')}
                >
                    Quay lại trang chủ
                </Button>
            </Box>
        </Container>
    );
};

export default Forbidden;