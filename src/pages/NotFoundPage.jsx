import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const NotFoundPage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center',
            }}
        >
            <Typography variant="h1" color="primary">
                404
            </Typography>
            <Typography variant="h6" color="textSecondary">
                Page Not Found
            </Typography>
            <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
                    Go to Login
                </Button>
            </Link>
        </Box>
    );
};

export default NotFoundPage;
