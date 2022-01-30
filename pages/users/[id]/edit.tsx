import { ErrorRounded } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Chip,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { LoginContext } from "../../../utils/auth";
import { UpdateUser, useGetUser } from "../../../utils/users";

export default function EditUser() {
    const router = useRouter();
    const { id } = router.query;
    const context = useContext(LoginContext);

    const { data: user, mutate: mutateUser } = useGetUser(`${id}`);
    const [passwordError, setPasswordError] = useState("");

    const [password, setPassword] = useState("");

    const [errorSnack, setErrorSnack] = useState<string | undefined>();
    const [successSnack, setSuccessSnack] = useState<string | undefined>();

    const handleUpdateUser = (body: { password?: string; admin?: boolean }) => {
        if (body.password !== undefined && password.length < 8) {
            setErrorSnack("Password must be at least 8 characters long");
            return;
        }
        if (user && context.tokenPair && context.setTokenPair) {
            UpdateUser(user.id, body, context.tokenPair, context.setTokenPair)
                .then(() => {
                    setSuccessSnack("User updated successfully");
                    mutateUser();
                })
                .catch((err) => {
                    if (err.message && typeof err.message === "string")
                        setErrorSnack(err.message);
                    else setErrorSnack(JSON.stringify(err));
                });
        }
    };

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPassword(event.target.value);

        if (event.target.value.length < 8)
            setPasswordError("Password must be at least 8 characters long");
        else setPasswordError("");
    };

    // safety check

    if (!user) return <div>Loading</div>;
    if (context.user === null) router.back();
    if (context.user === undefined) return <div>Loading</div>;
    if (!context.user?.admin) router.back();

    return (
        <Paper
            elevation={3}
            sx={{
                p: "1rem",
                maxWidth: "30rem",
                marginRight: "auto",
                marginLeft: "auto",
            }}
        >
            <Snackbar
                open={successSnack !== undefined}
                autoHideDuration={6000}
                onClose={() => setSuccessSnack(undefined)}
            >
                <Alert
                    onClose={() => setSuccessSnack(undefined)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    {successSnack}
                </Alert>
            </Snackbar>
            <Snackbar
                open={errorSnack !== undefined}
                autoHideDuration={6000}
                onClose={() => setErrorSnack(undefined)}
            >
                <Alert
                    onClose={() => setErrorSnack(undefined)}
                    severity="error"
                    sx={{ width: "100%" }}
                >
                    {errorSnack}
                </Alert>
            </Snackbar>
            <Stack spacing={2}>
                <Typography variant="h5">
                    {user.username}{" "}
                    {user.admin && (
                        <Chip
                            color="secondary"
                            label="Admin"
                            variant="outlined"
                        />
                    )}
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => handleUpdateUser({ admin: !user.admin })}
                >
                    {user.admin ? "Revoke admin" : "Make admin"}
                </Button>

                <TextField
                    type="password"
                    label="Change password"
                    onChange={handlePasswordChange}
                    helperText={passwordError}
                    error={passwordError.length > 0}
                />
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        handleUpdateUser({ password });
                    }}
                >
                    Update password
                </Button>
            </Stack>
        </Paper>
    );
}
