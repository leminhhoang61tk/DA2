import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Construction } from '@mui/icons-material';

const Maintenance = () => {
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
                <Construction sx={{ fontSize: 100, color: 'warning.main', mb: 4 }} />
                <Typography variant="h2" fontWeight="bold" color="text.primary" gutterBottom>
                    Đang bảo trì
                </Typography>
                <Typography variant="h5" color="text.primary" gutterBottom>
                    Hệ thống hiện đang được bảo trì
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mb: 4 }}>
                    Chúng tôi đang thực hiện một số nâng cấp và cải tiến.
                    Vui lòng quay lại sau. Dự kiến hoàn thành vào 18:00 ngày 24/04/2025.
                </Typography>
                <Box
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: 'background.paper',
                        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
                        maxWidth: 480,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Nếu cần hỗ trợ khẩn cấp, vui lòng liên hệ:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" color="primary.main">
                        support@smartship.com
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" color="primary.main">
                        Hotline: 1900 1234
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Maintenance;