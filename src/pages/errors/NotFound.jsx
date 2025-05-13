import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SentimentVeryDissatisfied } from '@mui/icons-material';

const NotFound = () => {
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
                <SentimentVeryDissatisfied sx={{ fontSize: 100, color: 'text.secondary', mb: 4 }} />
                <Typography variant="h1" fontWeight="bold" color="text.primary" gutterBottom>
                    404
                </Typography>
                <Typography variant="h4" color="text.primary" gutterBottom>
                    Trang không tồn tại
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mb: 4 }}>
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                    Vui lòng kiểm tra lại đường dẫn hoặc quay lại trang chủ.
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

export default NotFound;