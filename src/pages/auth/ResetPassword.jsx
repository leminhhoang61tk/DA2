import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
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
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    ArrowBack,
} from '@mui/icons-material';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    // Giả lập lấy token từ URL query params
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token') || 'demo-token';

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
                    Đặt lại mật khẩu
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Tạo mật khẩu mới cho tài khoản của bạn
                </Typography>

                {resetSuccess ? (
                    <>
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập bằng mật khẩu mới.
                        </Alert>
                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            onClick={() => navigate('/auth/login')}
                        >
                            Đăng nhập
                        </Button>
                    </>
                ) : (
                    <Formik
                        initialValues={{
                            password: '',
                            confirmPassword: '',
                        }}
                        validationSchema={Yup.object().shape({
                            password: Yup.string()
                                .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
                                .required('Vui lòng nhập mật khẩu mới'),
                            confirmPassword: Yup.string()
                                .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
                                .required('Vui lòng xác nhận mật khẩu'),
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                            // Giả lập đặt lại mật khẩu thành công
                            setTimeout(() => {
                                setResetSuccess(true);
                                setSubmitting(false);
                            }, 1000);
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
                                        error={Boolean(touched.password && errors.password)}
                                    >
                                        <InputLabel htmlFor="password-reset">Mật khẩu mới</InputLabel>
                                        <OutlinedInput
                                            id="password-reset"
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
                                            label="Mật khẩu mới"
                                        />
                                        {touched.password && errors.password && (
                                            <FormHelperText error>{errors.password}</FormHelperText>
                                        )}
                                    </FormControl>

                                    <FormControl
                                        fullWidth
                                        error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                    >
                                        <InputLabel htmlFor="confirm-password-reset">Xác nhận mật khẩu</InputLabel>
                                        <OutlinedInput
                                            id="confirm-password-reset"
                                            type={showPassword ? 'text' : 'password'}
                                            value={values.confirmPassword}
                                            name="confirmPassword"
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
                                            label="Xác nhận mật khẩu"
                                        />
                                        {touched.confirmPassword && errors.confirmPassword && (
                                            <FormHelperText error>{errors.confirmPassword}</FormHelperText>
                                        )}
                                    </FormControl>

                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Đặt lại mật khẩu
                                    </Button>
                                </Stack>
                            </form>
                        )}
                    </Formik>
                )}

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Link
                        component={RouterLink}
                        to="/auth/login"
                        variant="body2"
                        color="primary"
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <ArrowBack sx={{ mr: 0.5, fontSize: 16 }} />
                        Quay lại đăng nhập
                    </Link>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ResetPassword;