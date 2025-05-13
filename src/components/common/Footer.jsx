import React from 'react';
import { Box, Typography, Link, Divider } from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{ mt: 5, pt: 2, pb: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                    © 2025 SmartShipD. Bản quyền thuộc về Công ty TNHH Công nghệ SmartShipD.
                </Typography>
                <Box>
                    <Link href="#" underline="hover" color="inherit" sx={{ mr: 2 }}>
                        <Typography variant="body2">Điều khoản sử dụng</Typography>
                    </Link>
                    <Link href="#" underline="hover" color="inherit" sx={{ mr: 2 }}>
                        <Typography variant="body2">Chính sách bảo mật</Typography>
                    </Link>
                    <Link href="#" underline="hover" color="inherit">
                        <Typography variant="body2">Trợ giúp</Typography>
                    </Link>
                </Box>
            </Box>
        </Box>
    );
};

export default Footer;