import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';

const AboutUsPage = () => {
  return (
    <Container sx={{ my: 5 }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            About Us
          </Typography>
        </Grid>
        <Grid item xs={12} md={10}>
          <Box>
            <Typography variant="h6" align="center" paragraph>
              Welcome to <strong>Transport Management System</strong>, your all-in-one
              solution for efficiently managing transport operations. Whether you're
              an admin or a transporter, we streamline the entire process, from vehicle
              management to client bookings and employee oversight.
            </Typography>
            <Typography variant="h6" align="center" paragraph>
              At <strong>Transport Management System</strong>, we aim to bridge the gap
              between transport companies and clients by offering a secure and
              user-friendly platform. Our advanced system ensures seamless management
              of vehicles, client trips, employee details, and expenses, making
              day-to-day operations hassle-free.
            </Typography>
            <Typography variant="h6" align="center" paragraph>
              Join us today to take control of your transport business, streamline
              operations, track payments, and manage all aspects of your logistics in
              one place. We are committed to helping you grow and operate with
              efficiency and ease.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutUsPage;
