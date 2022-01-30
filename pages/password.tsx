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
import {
    ChangeUserPassword,
    RegisterUser,
    SearchUser,
    SearchUserFetch,
} from "../utils/users";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import { LoginContext } from "../utils/auth";

const ChangePassword = () => {
    const router = useRouter();

    const context = useContext(LoginContext);

    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [oldPasswordError, setOldPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessSnack, setShowSuccessSnack] = useState(false);

    // redirect to home page if already logged in

    if (context.user === null) router.push("/");

    const handleOldPasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setOldPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPasswordConfirm(event.target.value);

        if (password != event.target.value)
            setConfirmPasswordError("Passwords does not match");
        else setConfirmPasswordError("");
    };

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPassword(event.target.value);

        if (event.target.value.length < 8)
            setPasswordError("Password must be at least 8 characters long");
        else setPasswordError("");

        if (passwordConfirm.length > 0 && event.target.value != passwordConfirm)
            setConfirmPasswordError("Passwords does not match");
        else setConfirmPasswordError("");
    };

    const handleRegister = () => {
        if (!context.tokenPair || !context.user) {
            setErrorMessage("You must be logged in to change your password");
            return;
        }

        if (
            oldPasswordError.length > 0 ||
            passwordError.length > 0 ||
            confirmPasswordError.length > 0
        ) {
            setErrorMessage("There is at least one error in the form");
            return;
        }

        if (
            password.length < 1 ||
            passwordConfirm.length < 1 ||
            oldPassword.length < 1
        ) {
            setErrorMessage("please fill in all fields");

            if (password.length < 1) setPasswordError("Please fill this field");
            if (passwordConfirm.length < 1)
                setConfirmPasswordError("Please fill this field");
            if (oldPassword.length < 1)
                setOldPasswordError("Please fill this field");
            return;
        }

        ChangeUserPassword(
            oldPassword,
            password,
            context.tokenPair,
            context.setTokenPair
        )
            .then((res) => {
                setShowSuccessSnack(true);
            })
            .catch((err) => {
                if (err.message) setErrorMessage(`${err.message}`);
                else
                    setErrorMessage("There was an error contacting the server");
            });
    };

    const closeSuccessSnack = () => {
        setShowSuccessSnack(false);
    };

    return (
        <>
            <Snackbar
                open={showSuccessSnack}
                autoHideDuration={2000}
                onClose={closeSuccessSnack}
            >
                <Alert
                    onClose={closeSuccessSnack}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Password changed
                </Alert>
            </Snackbar>
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
                        <Typography variant="h5">Change password</Typography>
                        <Typography variant="h6">
                            {context.user?.username}
                        </Typography>
                        <TextField
                            required
                            label="Old password"
                            value={oldPassword}
                            onChange={handleOldPasswordChange}
                            helperText={oldPasswordError}
                            error={oldPasswordError.length > 0}
                            type="password"
                        />
                        <TextField
                            required
                            label="New password"
                            value={password}
                            onChange={handlePasswordChange}
                            type="password"
                            helperText={passwordError}
                            error={passwordError.length > 0}
                        />
                        <TextField
                            required
                            label="Confirm new password"
                            value={passwordConfirm}
                            onChange={handleConfirmPasswordChange}
                            type="password"
                            helperText={confirmPasswordError}
                            error={confirmPasswordError.length > 0}
                        />
                        <Button variant="contained" onClick={handleRegister}>
                            Update
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </>
    );
};

export default ChangePassword;
