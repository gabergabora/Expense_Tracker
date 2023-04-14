import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Divider, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import Logo from "../../assets/images/logos/Logo";
import { useEffect } from "react";

const AuthWrapper = (props) => {
    let navigate = useNavigate();
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
    useEffect(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        let user = localStorage.getItem("user");
        if (user) navigate("/");
    }, []);
    return (
        <div
            style={{
                maxWidth: "100%",
                backgroundImage:
                    "radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px)",
                backgroundSize: "10px 10px",
      
            }}
        >
            <div
                style={{
                    width: "98%",
                    maxWidth: "600px",
                    margin: "0 auto",
                    userSelect: "none",
                    // backgroundColor: "#e5e5f7",
                    opacity: 0.8,
                    backdropFilter: "blur(3px)"
                }}
            >
                <Grid
                    container
                    direction="column"
                    justifyContent="flex-end"
                    sx={{ minHeight: "100vh" }}
                >
                    <Grid item xs={12}>
                        <Grid
                            container
                            justifyContent="center"
                            alignItems="center"
                            sx={{ minHeight: "calc(100vh - 68px)" }}
                        >
                            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                                <>
                                    <Grid
                                        container
                                        spacing={2}
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Grid item sx={{ mb: 3 }}>
                                            <Link
                                                to="#"
                                                style={{
                                                    textDecoration: "none",
                                                }}
                                            >
                                                <Logo />
                                            </Link>
                                        </Grid>
                                        <Grid item xs={12}></Grid>
                                        <Grid item xs={12}>
                                            {props.children}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid
                                                item
                                                container
                                                direction="column"
                                                alignItems="center"
                                                xs={12}
                                            >
                                                {props.type === "login" ? (
                                                    <Typography
                                                        component={Link}
                                                        to="/register"
                                                        sx={{
                                                            textDecoration:
                                                                "none",
                                                        }}
                                                    >
                                                        Don&apos;t have an
                                                        account?
                                                    </Typography>
                                                ) : (
                                                    <Typography
                                                        component={Link}
                                                        to="/login"
                                                        sx={{
                                                            textDecoration:
                                                                "none",
                                                        }}
                                                    >
                                                        Already have an account?
                                                    </Typography>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default AuthWrapper;
