import { useState } from 'react';
import { TextField, Button, CircularProgress, Card, CardContent, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    const handleSubmit = () => {
        const newErrors = {};

        // Validation
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const requestOptions = {
            method: 'POST',
            url: `${backendUrl}/api/auth/login`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: { email, password },
        };

        axios(requestOptions)
            .then((response) => {
                setLoading(false);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/dashboard');
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    };

    return (
        <Paper
            sx={{
                background: 'linear-gradient(to right, #6a11cb, #2575fc)',
                height: '97vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 0,
            }}
        >
            <Card sx={{ width: 400, borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center" color="#000">
                        Login
                    </Typography>

                    <TextField
                        label={<>Email<span style={{ color: 'red' }}>*</span></>}
                        name="email"
                        value={email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                    />

                    <TextField
                        label={<>Password<span style={{ color: 'red' }}>*</span></>}
                        name="password"
                        type="password"
                        value={password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                    </Button>

                    <Typography variant="body2" align="center" sx={{ marginTop: 2, color: '#000' }}>
                        Don't have an account?{' '}
                        <Button
                            onClick={() => navigate('/signup')}
                            sx={{
                                color: '#000',
                                textTransform: 'none',
                                '&:hover': {
                                    color: 'blue',
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            Sign up here
                        </Button>
                    </Typography>
                </CardContent>
            </Card>
        </Paper>
    );
};

export default LoginPage;
