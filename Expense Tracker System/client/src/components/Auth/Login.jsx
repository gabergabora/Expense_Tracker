import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
    useMediaQuery,
} from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AuthWrapper from "./AuthWrapper";
import Google from "../../assets/images/icons/social-google.svg";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import CustomHttp from "../CustomHttp";

const Login = (props) => {
    const theme = useTheme();
    const [messageApi, contextHolder] = message.useMessage();

    messageApi.open({
        type: "error",
        content: props.message,
    });
    let navigate = useNavigate();
    const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
    const [checked, setChecked] = useState(true);

    const googleHandler = async () => {
        console.error("Login");
    };

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <AuthWrapper type="login">
            {contextHolder}
            <div>
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <div>
                            <Button
                                disableElevation
                                fullWidth
                                onClick={googleHandler}
                                size="large"
                                variant="outlined"
                                sx={{
                                    color: "grey.700",
                                    backgroundColor: theme.palette.grey[50],
                                    borderColor: theme.palette.grey[100],
                                }}
                            >
                                <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                                    <img
                                        src={Google}
                                        alt="google"
                                        width={16}
                                        height={16}
                                        style={{
                                            marginRight: matchDownSM ? 8 : 16,
                                        }}
                                    />
                                </Box>
                                Sign in with Google
                            </Button>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                alignItems: "center",
                                display: "flex",
                            }}
                        >
                            <Divider
                                sx={{ flexGrow: 1 }}
                                orientation="horizontal"
                            />

                            <Button
                                variant="outlined"
                                sx={{
                                    cursor: "unset",
                                    m: 2,
                                    py: 0.5,
                                    px: 7,
                                    borderColor: `${theme.palette.grey[100]} !important`,
                                    color: `${theme.palette.grey[900]}!important`,
                                    fontWeight: 500,
                                    borderRadius: `${10}px`,
                                }}
                                disableRipple
                                disabled
                            >
                                OR
                            </Button>

                            <Divider
                                sx={{ flexGrow: 1 }}
                                orientation="horizontal"
                            />
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        container
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">
                                Sign in with Username
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Formik
                    initialValues={{
                        userName: "sudarshan",
                        password: "123456",
                        submit: null,
                    }}
                    validationSchema={Yup.object().shape({
                        userName: Yup.string()
                            .max(255)
                            .required("Username is required"),
                        password: Yup.string()
                            .max(255)
                            .required("Password is required"),
                    })}
                    onSubmit={async (
                        values,
                        { setErrors, setStatus, setSubmitting }
                    ) => {
                        try {
                            await CustomHttp({
                                url: "/auth/login",
                                method: "POST",
                                data: values,
                            })
                                .then(function (response) {
                                    if (response.status === 200) {
                                        localStorage.setItem(
                                            "user",
                                            JSON.stringify(response.data.user)
                                        );
                                        localStorage.setItem(
                                            "token",
                                            response.data.usertoken
                                        );
                                        setStatus({ success: true });
                                        setSubmitting(false);
                                        message.success(
                                            "Login Successfull, Welcome"
                                        );
                                        navigate("/");
                                    } else {
                                        message.error(
                                            "Invalid username and password"
                                        );
                                    }
                                })
                                .catch(function (error) {
                                    message.error(
                                        "Invalid username and password"
                                    );
                                })
                                .finally(function () {
                                    setStatus({ success: true });
                                    setSubmitting(false);
                                });
                        } catch (err) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
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
                            <FormControl
                                fullWidth
                                error={Boolean(
                                    touched.userName && errors.userName
                                )}
                                sx={{ ...theme.typography.customInput }}
                                style={{ marginTop: "10px" }}
                            >
                                <InputLabel htmlFor="outlined-adornment-userName-register">
                                    Username
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-userName-register"
                                    type="text"
                                    name="userName"
                                    label="userName"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    inputProps={{}}
                                />
                                {touched.userName && errors.userName && (
                                    <FormHelperText
                                        error
                                        id="standard-weight-helper-text-userName-register"
                                    >
                                        {errors.userName}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl
                                fullWidth
                                error={Boolean(
                                    touched.password && errors.password
                                )}
                                sx={{ ...theme.typography.customInput }}
                                style={{ marginTop: "10px" }}
                            >
                                <InputLabel htmlFor="outlined-adornment-password-register">
                                    Password
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password-register"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    label="Password"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={
                                                    handleClickShowPassword
                                                }
                                                onMouseDown={
                                                    handleMouseDownPassword
                                                }
                                                edge="end"
                                                size="large"
                                            >
                                                {showPassword ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    inputProps={{}}
                                />
                                {touched.password && errors.password && (
                                    <FormHelperText
                                        error
                                        id="standard-weight-helper-text-password-register"
                                    >
                                        {errors.password}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                spacing={1}
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={(event) =>
                                                setChecked(event.target.checked)
                                            }
                                            name="checked"
                                            color="primary"
                                        />
                                    }
                                    label="Remember me"
                                />
                                <Typography
                                    variant="subtitle1"
                                    color="secondary"
                                    sx={{
                                        textDecoration: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    Forgot Password?
                                </Typography>
                            </Stack>
                            {errors.submit && (
                                <Box sx={{ mt: 3 }}>
                                    <FormHelperText error>
                                        {errors.submit}
                                    </FormHelperText>
                                </Box>
                            )}

                            <Box sx={{ mt: 2 }}>
                                <div>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Sign in
                                    </Button>
                                </div>
                            </Box>
                        </form>
                    )}
                </Formik>
            </div>
        </AuthWrapper>
    );
};

export default Login;
