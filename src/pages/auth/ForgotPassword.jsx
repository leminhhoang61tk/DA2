import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    FormHelperText,
    InputLabel,
    Link,
    OutlinedInput,
    Stack,
    Typography,
    Alert,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [resetSent, setResetSent] = useState(false);

    return (
        <Card elevation={4} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Quên mật khẩu
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
                </Typography>

                {resetSent ? (
                    <>
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.
                        </Alert>
                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            onClick={() => navigate('/auth/login')}
                        >
                            Quay lại đăng nhập
                        </Button>
                    </>
                ) : (
                    <Formik
                        initialValues={{
                            email: '',
                        }}
                        validationSchema={Yup.object().shape({
                            email: Yup.string()
                                .email('Email không hợp lệ')
                                .required('Vui lòng nhập email'),
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                            // Giả lập gửi email đặt lại mật khẩu
                            setTimeout(() => {
                                setResetSent(true);
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
                                        error={Boolean(touched.email && errors.email)}
                                    >
                                        <InputLabel htmlFor="email-reset">Email</InputLabel>
                                        <OutlinedInput
                                            id="email-reset"
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

                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Gửi hướng dẫn đặt lại
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

export default ForgotPassword;