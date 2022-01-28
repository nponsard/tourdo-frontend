import { Team } from "../utils/teams";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
    Alert,
    CardHeader,
    Paper,
    Snackbar,
    Stack,
    TextField,
} from "@mui/material";
import { typography } from "@mui/system";
import { useContext, useState } from "react";
import { RegisterUser, SearchUser, SearchUserFetch } from "../utils/users";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import { LoginContext, LoginUser } from "../utils/auth";

const Login = () => {
    const router = useRouter();

    const context = useContext(LoginContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    // redirect to home page if already logged in

    if (context.user) router.push("/");

    console.log(context);

    const handleUsernameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPassword(event.target.value);
    };

    const handleLogin = () => {
        LoginUser(username, password, context.tokenManager)
            .then((res) => {
                router.push("/");
            })
            .catch((err) => {
                if (err.message) setErrorMessage(`${err.message}`);
                else
                    setErrorMessage("There was an error contacting the server");
            });
    };

    // redirect to home page if already logged in

    if (context.user) return router.push("/");

    return (
        <>
            <Snackbar
                open={errorMessage.length > 0}
                autoHideDuration={6000}
                onClose={() => setErrorMessage("")}
            >
                <Alert
                    onClose={() => setErrorMessage("")}
                    severity="error"
                    sx={{ width: "100%" }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>

            <Paper
                elevation={3}
                sx={{
                    maxWidth: "30rem",
                    p: "2rem",
                    marginRight: "auto",
                    marginLeft: "auto",
                }}
            >
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        alignItems: "right",
                        flexFlow: "column",
                    }}
                >
                    <Stack spacing={2}>
                        <Typography variant="h5">Log in </Typography>
                        <TextField
                            required
                            label="Username"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <TextField
                            required
                            label="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            type="password"
                        />
                        <Button variant="contained" onClick={handleLogin}>
                            Login
                        </Button>
                        <Typography>
                            Don’t have an account ?{" "}
                            <Link href="/register" passHref>
                                <Typography component="a" color="primary">
                                    Register here
                                </Typography>
                            </Link>
                        </Typography>
                    </Stack>
                </Box>
            </Paper>
        </>
    );
};

export default Login;
