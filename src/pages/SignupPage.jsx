import { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, Card, CardContent, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            setName(value);
        } else if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
        }
    };

    const handleSubmit = () => {
        const newErrors = {};
    
        if (!name) newErrors.name = 'Name is required';
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
        if (password !== confirmPassword) newErrors.passwordMismatch = 'Passwords do not match';
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        setLoading(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
        const requestOptions = {
            method: 'POST',
            url: `${backendUrl}/api/auth/register`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: { name, email, password },
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
                        Sign Up
                    </Typography>

                    <TextField
                        label={<>Name<span style={{ color: 'red' }}>*</span></>}
                        name="name"
                        value={name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                    />

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

                    <TextField
                        label={<>Confirm Password<span style={{ color: 'red' }}>*</span></>}
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        error={Boolean(errors.confirmPassword || errors.passwordMismatch)}
                        helperText={errors.confirmPassword || errors.passwordMismatch}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                    </Button>

                    <Typography variant="body2" align="center" sx={{ marginTop: 2, color: '#000' }}>
                        Already have an account?{' '}
                        <Button
                            onClick={() => navigate('/login')}
                            sx={{
                                color: '#000',
                                textTransform: 'none',
                                '&:hover': {
                                    color: 'blue',
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            Login here
                        </Button>
                    </Typography>
                </CardContent>
            </Card>
        </Paper>
    );
};

export default SignupPage;
