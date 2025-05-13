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

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [registerError, setRegisterError] = useState(null);

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
                    Đăng ký tài khoản
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Đăng ký để bắt đầu sử dụng hệ thống SmartShipD
                </Typography>

                {registerError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {registerError}
                    </Alert>
                )}

                <Formik
                    initialValues={{
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        terms: false,
                    }}
                    validationSchema={Yup.object().shape({
                        name: Yup.string().required('Vui lòng nhập họ tên'),
                        email: Yup.string()
                            .email('Email không hợp lệ')
                            .required('Vui lòng nhập email'),
                        password: Yup.string()
                            .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
                            .required('Vui lòng nhập mật khẩu'),
                        confirmPassword: Yup.string()
                            .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
                            .required('Vui lòng xác nhận mật khẩu'),
                        terms: Yup.boolean().oneOf([true], 'Bạn phải đồng ý với điều khoản sử dụng'),
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            // Giả lập đăng ký thành công
                            setTimeout(() => {
                                navigate('/auth/login');
                            }, 1000);
                        } catch (error) {
                            setRegisterError('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.');
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
                                    error={Boolean(touched.name && errors.name)}
                                >
                                    <InputLabel htmlFor="name-register">Họ tên</InputLabel>
                                    <OutlinedInput
                                        id="name-register"
                                        value={values.name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Họ tên"
                                        placeholder="Nguyễn Văn A"
                                    />
                                    {touched.name && errors.name && (
                                        <FormHelperText error>{errors.name}</FormHelperText>
                                    )}
                                </FormControl>

                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.email && errors.email)}
                                >
                                    <InputLabel htmlFor="email-register">Email</InputLabel>
                                    <OutlinedInput
                                        id="email-register"
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
                                    <InputLabel htmlFor="password-register">Mật khẩu</InputLabel>
                                    <OutlinedInput
                                        id="password-register"
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

                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                >
                                    <InputLabel htmlFor="confirm-password-register">Xác nhận mật khẩu</InputLabel>
                                    <OutlinedInput
                                        id="confirm-password-register"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.confirmPassword}
                                        name="confirmPassword"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Xác nhận mật khẩu"
                                    />
                                    {touched.confirmPassword && errors.confirmPassword && (
                                        <FormHelperText error>{errors.confirmPassword}</FormHelperText>
                                    )}
                                </FormControl>

                                <FormControl error={Boolean(touched.terms && errors.terms)}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.terms}
                                                onChange={handleChange}
                                                name="terms"
                                                color="primary"
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">
                                                Tôi đồng ý với{' '}
                                                <Link href="#" underline="hover" color="primary">
                                                    Điều khoản sử dụng
                                                </Link>{' '}
                                                và{' '}
                                                <Link href="#" underline="hover" color="primary">
                                                    Chính sách bảo mật
                                                </Link>
                                            </Typography>
                                        }
                                    />
                                    {touched.terms && errors.terms && (
                                        <FormHelperText error>{errors.terms}</FormHelperText>
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
                                    Đăng ký
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
                        onClick={() => setRegisterError('Đăng ký bằng Google chưa được hỗ trợ')}
                    >
                        Google
                    </Button>
                    <Button
                        fullWidth
                        size="large"
                        variant="outlined"
                        startIcon={<FacebookIcon />}
                        onClick={() => setRegisterError('Đăng ký bằng Facebook chưa được hỗ trợ')}
                    >
                        Facebook
                    </Button>
                </Stack>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Đã có tài khoản?{' '}
                        <Link
                            component={RouterLink}
                            to="/auth/login"
                            variant="body2"
                            color="primary"
                            fontWeight="medium"
                        >
                            Đăng nhập
                        </Link>
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Register;