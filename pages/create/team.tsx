import {
    Alert,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
    Snackbar,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { LoginContext } from "../../utils/auth";
import {
    CreateTournament,
    TournamentnTypeName,
    TournamentType,
} from "../../utils/tournaments";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { CreateTeam } from "../../utils/teams";

export default function TeamCreation() {
    const context = useContext(LoginContext);
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    console.log("user :", context.user);

    if (context.user === null) router.push("/");

    const handleCreate = () => {
        if (context.tokenPair && context.setTokenPair) {
            CreateTeam(
                name,
                description,
                context.tokenPair,
                context.setTokenPair
            )
                .then((value) => {
                    if (value.id || value.id === 0)
                        router.push(`/tournament/${value.id}/edit`);
                    else setErrorMessage("An error occured");
                })
                .catch((error) => {
                    if (error.message) setErrorMessage(error.message);
                    else setErrorMessage(JSON.stringify(error));
                });
        }
    };

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
                    maxWidth: "40rem",
                    p: "2rem",
                    marginRight: "auto",
                    marginLeft: "auto",
                }}
            >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box component="form">
                        <Stack spacing={2}>
                            <Typography
                                variant="h5"
                                sx={{ textAlign: "center" }}
                            >
                                Create a team
                            </Typography>

                            {/* name  */}
                            <TextField
                                required
                                fullWidth
                                label="Tournament Name"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                            />

                            {/* description  */}
                            <TextField
                                label="Description"
                                multiline
                                maxRows={10}
                                value={description}
                                fullWidth
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                            />

                            <Button variant="contained" onClick={handleCreate}>
                                Create
                            </Button>
                        </Stack>
                    </Box>
                </LocalizationProvider>
            </Paper>
        </>
    );
}
