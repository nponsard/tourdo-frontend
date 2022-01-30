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
    TournamentTypeName,
    TournamentType,
} from "../../utils/tournaments";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

export default function TournamentCreation() {
    const context = useContext(LoginContext);
    const router = useRouter();

    const [type, setType] = useState(TournamentType.None);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [maxTeams, setMaxTeams] = useState(10);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [game, setGame] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    console.log("user :", context.user);

    if (context.user === null) router.push("/");

    const handleCreate = () => {
        if (context.tokenPair && context.setTokenPair) {
            CreateTournament(
                name,
                description,
                startDate,
                endDate,
                maxTeams,
                game,
                type,
                context.tokenPair,
                context.setTokenPair
            )
                .then((value) => {
                    if (value.id || value.id === 0)
                        router.push(`/tournaments/${value.id}/edit`);
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
                                Create a tournament
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

                            {/* type  */}
                            <FormControl fullWidth>
                                <InputLabel id="type-select-label">
                                    Tournament Type
                                </InputLabel>
                                <Select
                                    labelId="type-select-label"
                                    value={type}
                                    label="Tournament type"
                                    onChange={(event) =>
                                        setType(
                                            event.target.value as TournamentType
                                        )
                                    }
                                >
                                    {TournamentTypeName.map((name, index) => (
                                        <MenuItem key={index} value={index}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Box>
                                {/* start_date  */}

                                <DatePicker
                                    label="Start date"
                                    views={["year", "month", "day"]}
                                    value={startDate}
                                    onChange={(newValue) => {
                                        setStartDate(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            sx={{
                                                width: "47%",
                                                marginRight: "6%",
                                            }}
                                            {...params}
                                        />
                                    )}
                                />

                                {/* end_date  */}
                                <DatePicker
                                    label="End date"
                                    views={["year", "month", "day"]}
                                    value={endDate}
                                    onChange={(newValue) => {
                                        setEndDate(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            sx={{ width: "47%" }}
                                            {...params}
                                        />
                                    )}
                                />
                            </Box>

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

                            {/* max_teams  */}

                            <TextField
                                label="Maximum number of teams"
                                type="number"
                                value={maxTeams}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(event) =>
                                    setMaxTeams(parseInt(event.target.value))
                                }
                                error={maxTeams < 1}
                            />

                            {/* game_name  */}

                            <TextField
                                label="Game"
                                value={game}
                                onChange={(event) =>
                                    setGame(event.target.value)
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
