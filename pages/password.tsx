import { Alert, Paper, Snackbar, Stack, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import GenericSnackBar from "../components/GenericSnackBar";
import { LoginContext } from "../utils/auth";
import { FetchChangeUserPassword } from "../utils/users";

const ChangePassword = () => {
    const router = useRouter();

    const context = useContext(LoginContext);

    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [oldPasswordError, setOldPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

    // redirect to home page if already logged in

    if (context.user === null) router.push("/");

    const handleOldPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOldPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirm(event.target.value);

        if (password != event.target.value) setConfirmPasswordError("Passwords does not match");
        else setConfirmPasswordError("");
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);

        if (event.target.value.length < 8) setPasswordError("Password must be at least 8 characters long");
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

        if (oldPasswordError.length > 0 || passwordError.length > 0 || confirmPasswordError.length > 0) {
            setErrorMessage("There is at least one error in the form");
            return;
        }

        if (password.length < 1 || passwordConfirm.length < 1 || oldPassword.length < 1) {
            setErrorMessage("please fill in all fields");

            if (password.length < 1) setPasswordError("Please fill this field");
            if (passwordConfirm.length < 1) setConfirmPasswordError("Please fill this field");
            if (oldPassword.length < 1) setOldPasswordError("Please fill this field");
            return;
        }

        FetchChangeUserPassword(oldPassword, password, context.tokenPair, context.setTokenPair)
            .then((res) => {
                setSuccessMessage("Password changed successfully");
            })
            .catch((err) => {
                if (err.message) setErrorMessage(`${err.message}`);
                else setErrorMessage("There was an error contacting the server");
            });
    };

    return (
        <>
            <GenericSnackBar message={successMessage} setMessage={setSuccessMessage} severity="success" />
            <GenericSnackBar message={errorMessage} setMessage={setErrorMessage} severity="error" />
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
                        <Typography variant="h6">{context.user?.username}</Typography>
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
