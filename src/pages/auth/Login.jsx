import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    Link,
    OutlinedInput,
    Stack,
    Typography,
    Alert,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Google as GoogleIcon,
    Facebook as FacebookIcon,
} from '@mui/icons-material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';

import { authenticateUser } from '../../mockData/users';


const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState(null);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Card elevation={4} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Đăng nhập
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Đăng nhập để truy cập vào hệ thống SmartShipD
                </Typography>

                {loginError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {loginError}
                    </Alert>
                )}

                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                        remember: false,
                    }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string()
                            .email('Email không hợp lệ')
                            .required('Vui lòng nhập email'),
                        password: Yup.string().required('Vui lòng nhập mật khẩu'),
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            setLoginError(null);
                            // Xác thực người dùng
                            const authenticatedUser = authenticateUser(values.email, values.password);

                            if (authenticatedUser) {
                                login(authenticatedUser);

                                // Chuyển hướng đến dashboard tương ứng với vai trò
                                switch (authenticatedUser.role) {
                                    case 'admin':
                                        navigate('/admin/dashboard');
                                        break;
                                    case 'manager':
                                        navigate('/manager/dashboard');
                                        break;
                                    case 'dispatcher':
                                        navigate('/dispatcher/dashboard');
                                        break;
                                    case 'driver':
                                        navigate('/driver/dashboard');
                                        break;
                                    case 'customer':
                                        navigate('/customer/dashboard');
                                        break;
                                    default:
                                        navigate('/dashboard');
                                }
                            } else {
                                setLoginError('Email hoặc mật khẩu không đúng');
                            }
                        } catch (error) {
                            setLoginError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.');
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({
                        errors,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        values,
                    }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.email && errors.email)}
                                >
                                    <InputLabel htmlFor="email-login">Email</InputLabel>
                                    <OutlinedInput
                                        id="email-login"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Email"
                                        placeholder="example@smartship.com"
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error>{errors.email}</FormHelperText>
                                    )}
                                </FormControl>

                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.password && errors.password)}
                                >
                                    <InputLabel htmlFor="password-login">Mật khẩu</InputLabel>
                                    <OutlinedInput
                                        id="password-login"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Mật khẩu"
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error>{errors.password}</FormHelperText>
                                    )}
                                </FormControl>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.remember}
                                                onChange={handleChange}
                                                name="remember"
                                                color="primary"
                                            />
                                        }
                                        label="Ghi nhớ đăng nhập"
                                    />
                                    <Link
                                        component={RouterLink}
                                        to="/auth/forgot-password"
                                        variant="body2"
                                        color="primary"
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </Box>

                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Đăng nhập
                                </Button>
                            </Stack>
                        </form>
                    )}
                </Formik>

                <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        HOẶC
                    </Typography>
                </Divider>

                <Stack direction="row" spacing={2}>
                    <Button
                        fullWidth
                        size="large"
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        onClick={() => setLoginError('Đăng nhập bằng Google chưa được hỗ trợ')}
                    >
                        Google
                    </Button>
                    <Button
                        fullWidth
                        size="large"
                        variant="outlined"
                        startIcon={<FacebookIcon />}
                        onClick={() => setLoginError('Đăng nhập bằng Facebook chưa được hỗ trợ')}
                    >
                        Facebook
                    </Button>
                </Stack>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Chưa có tài khoản?{' '}
                        <Link
                            component={RouterLink}
                            to="/auth/register"
                            variant="body2"
                            color="primary"
                            fontWeight="medium"
                        >
                            Đăng ký ngay
                        </Link>
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Login;