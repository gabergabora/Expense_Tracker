import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// material-ui
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
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import CustomHttp from "../CustomHttp";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import Google from "../../assets/images/icons/social-google.svg";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AuthWrapper from "./AuthWrapper";
import { message } from "antd";

const Register = ({ ...others }) => {
    const theme = useTheme();
    let navigate = useNavigate();
    const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(true);

    const googleHandler = async () => {
        console.error("Register");
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <AuthWrapper type="register">
            <>
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={googleHandler}
                                size="large"
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
                                Sign up with Google
                            </Button>
                        </>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ alignItems: "center", display: "flex" }}>
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
                                Sign up with username
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Formik
                    initialValues={{
                        userName: "",
                        password: "",
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
                                url: "/auth/register",
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
                                            "Registration Successfull, Welcome"
                                        );
                                        navigate("/");
                                    } else {
                                        message.error("Something went wrong");
                                    }
                                })
                                .catch(function (error) {
                                    message.error("Something went wrong");
                                    console.log(error);
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
                            <Grid container spacing={matchDownSM ? 0 : 2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        margin="normal"
                                        name="firstName"
                                        type="text"
                                        defaultValue=""
                                        sx={{ ...theme.typography.customInput }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        margin="normal"
                                        name="lastName"
                                        type="text"
                                        defaultValue=""
                                        sx={{ ...theme.typography.customInput }}
                                    />
                                </Grid>
                            </Grid>
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
                                    value={values.password}
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

                            <Grid
                                container
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Grid item>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={checked}
                                                onChange={(event) =>
                                                    setChecked(
                                                        event.target.checked
                                                    )
                                                }
                                                name="checked"
                                                color="primary"
                                            />
                                        }
                                        label={
                                            <Typography variant="subtitle1">
                                                Agree with &nbsp;
                                                <Typography
                                                    variant="subtitle1"
                                                    component={Link}
                                                    to="#"
                                                >
                                                    Terms & Condition.
                                                </Typography>
                                            </Typography>
                                        }
                                    />
                                </Grid>
                            </Grid>
                            {errors.submit && (
                                <Box sx={{ mt: 3 }}>
                                    <FormHelperText error>
                                        {errors.submit}
                                    </FormHelperText>
                                </Box>
                            )}

                            <Box sx={{ mt: 2 }}>
                                <>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Sign up
                                    </Button>
                                </>
                            </Box>
                        </form>
                    )}
                </Formik>
            </>
        </AuthWrapper>
    );
};

export default Register;
