import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Error } from '@mui/icons-material';

const ServerError = () => {
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
                <Error sx={{ fontSize: 100, color: 'error.main', mb: 4 }} />
                <Typography variant="h1" fontWeight="bold" color="text.primary" gutterBottom>
                    500
                </Typography>
                <Typography variant="h4" color="text.primary" gutterBottom>
                    Lỗi máy chủ
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mb: 4 }}>
                    Đã xảy ra lỗi trên máy chủ. Chúng tôi đang khắc phục sự cố này.
                    Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ nếu sự cố vẫn tiếp diễn.
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

export default ServerError;