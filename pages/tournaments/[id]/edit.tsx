import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
    Alert,
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import AddUserModal from "../../../components/AddUserModal";
import { LoginContext } from "../../../utils/auth";
import {
    AddMatch,
    AddTournamentOrganizer,
    AddTournamentTeam,
    DeleteMatch,
    EditTournament,
    GenerateMatches,
    RemoveTournamentOrganizer,
    ShuffleTournamentTeams,
    Tournament,
    TournamentStatus,
    TournamentType,
    TournamentTypeName,
    UpdateMatch,
    useGetTournament,
    useGetTournamentMatches,
    useGetTournamentOrganizers,
    useGetTournamentTeams,
} from "../../../utils/tournaments";
import { TabPanel } from "../../../components/TabPanel";

import { User } from "../../../utils/users";
import AddTeamModal from "../../../components/AddTeamModal";
import { Team } from "../../../utils/teams";
import TeamSelector from "../../../components/TeamSelector";
import { Match, MatchStatus } from "../../../utils/matches";
import Link from "next/link";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const TournamentEditor = () => {
    const router = useRouter();
    const { id } = router.query;
    const context = useContext(LoginContext);

    // const [localMembers, setLocalMembers] = useState<TeamMember[]>([]);

    const [errorSnack, setErrorSnack] = useState<string | undefined>();
    const [successSnack, setSuccessSnack] = useState<string | undefined>();
    const [openOrganizerModal, setOpenOrganizerModal] = useState(false);
    const [openAddTeamModal, setOpenAddTeamModal] = useState(false);
    const [currentTab, setTab] = useState(0);

    const [localTournament, setLocalTournament] = useState<
        Tournament | undefined
    >(undefined);

    const { data: organizers, mutate: mutateOrganizers } =
        useGetTournamentOrganizers(`${id}`);
    const { data: tournament, mutate: mutateTournament } = useGetTournament(
        `${id}`
    );
    const { data: teams, mutate: mutateTeams } = useGetTournamentTeams(`${id}`);
    const { data: matches, mutate: mutateMatches } = useGetTournamentMatches(
        `${id}`
    );

    const teamList: Team[] = teams
        ? teams.map((entry) => {
              return entry.team;
          })
        : [];

    useEffect(() => {
        if (tournament) {
            setLocalTournament(tournament);
        }
    }, [tournament]);

    const handleApply = useCallback(() => {
        if (localTournament && context.tokenPair && context.setTokenPair) {
            EditTournament(
                localTournament,
                context.tokenPair,
                context.setTokenPair
            )
                .then(() => {
                    setSuccessSnack("Team edited successfully");
                })
                .catch((e) => {
                    if (e.message && typeof e.message === "string")
                        setErrorSnack(e.message);
                    else setErrorSnack(JSON.stringify(e));
                });
        }
    }, [context.tokenPair, context.setTokenPair, localTournament]);

    const handleDeleteOrganizer = useCallback(
        (id: number) => {
            if (tournament && context.tokenPair && context.setTokenPair) {
                RemoveTournamentOrganizer(
                    tournament.id,
                    id,
                    context.tokenPair,
                    context.setTokenPair
                )
                    .then(() => {
                        setSuccessSnack("Organizer removed successfully");
                        mutateOrganizers();
                    })
                    .catch((e) => {
                        if (e.message && typeof e.message === "string")
                            setErrorSnack(e.message);
                        else setErrorSnack(JSON.stringify(e));
                        mutateOrganizers();
                    });
            }
        },
        [context.setTokenPair, context.tokenPair, mutateOrganizers, tournament]
    );

    const handleAddTeams = useCallback(
        (teams: Team[]) => {
            const promises = teams.map((team) => {
                if (tournament && context.tokenPair && context.setTokenPair) {
                    return AddTournamentTeam(
                        tournament.id,
                        team.id,
                        context.tokenPair,
                        context.setTokenPair
                    );
                }
            });

            Promise.allSettled(promises).then((results) => {
                if (results.some((result) => result.status === "rejected")) {
                    const error = results.filter(
                        (result) => result.status === "rejected"
                    )[0] as { reason: any };
                    if (error.reason.message)
                        setErrorSnack(error.reason.message);
                    else setErrorSnack("Some teams could not be added");

                    console.log(results);
                } else {
                    setSuccessSnack("User(s) added successfully");
                }
                mutateTeams();
            });
        },
        [context.setTokenPair, context.tokenPair, mutateTeams, tournament]
    );
    const handleAddOrganizers = useCallback(
        (users: User[]) => {
            const promises = users.map((user) => {
                if (tournament && context.tokenPair && context.setTokenPair) {
                    return AddTournamentOrganizer(
                        tournament.id,
                        user.id,
                        context.tokenPair,
                        context.setTokenPair
                    );
                }
            });

            Promise.allSettled(promises).then((results) => {
                if (results.some((result) => result.status === "rejected")) {
                    setErrorSnack("Failed to add some users");
                    console.log(results);
                } else {
                    setSuccessSnack("User(s) added successfully");
                }
                mutateOrganizers();
            });
        },
        [context.setTokenPair, context.tokenPair, mutateOrganizers, tournament]
    );

    const handleAddMatch = useCallback(() => {
        if (tournament && context.tokenPair && context.setTokenPair) {
            AddMatch(tournament.id, context.tokenPair, context.setTokenPair)
                .then(() => {
                    mutateMatches();
                })
                .catch((e) => {
                    setErrorSnack(JSON.stringify(e));
                    mutateMatches();
                });
        }
    }, [context.setTokenPair, context.tokenPair, mutateMatches, tournament]);
    const handleGenerateMatches = useCallback(() => {
        if (tournament && context.tokenPair && context.setTokenPair) {
            GenerateMatches(
                tournament.id,
                context.tokenPair,
                context.setTokenPair
            )
                .then(() => {
                    mutateMatches();
                    setSuccessSnack("Matches generated successfully");
                })
                .catch((e) => {
                    setErrorSnack(JSON.stringify(e));
                    mutateMatches();
                });
        }
    }, [context.setTokenPair, context.tokenPair, mutateMatches, tournament]);

    const handleUpdateMatch = useCallback(
        (match: Match) => {
            if (tournament && context.tokenPair && context.setTokenPair) {
                UpdateMatch(match, context.tokenPair, context.setTokenPair)
                    .then(() => {
                        mutateMatches();
                    })
                    .catch((e) => {
                        setErrorSnack(JSON.stringify(e));
                        mutateMatches();
                    });
            }
        },
        [context.setTokenPair, context.tokenPair, mutateMatches, tournament]
    );
    const handleDeleteMatch = useCallback(
        (match: Match) => {
            if (tournament && context.tokenPair && context.setTokenPair) {
                DeleteMatch(match.id, context.tokenPair, context.setTokenPair)
                    .then(() => {
                        mutateMatches();
                    })
                    .catch((e) => {
                        setErrorSnack(JSON.stringify(e));
                        mutateMatches();
                    });
            }
        },
        [context.setTokenPair, context.tokenPair, mutateMatches, tournament]
    );

    const handleReset = useCallback(() => {
        if (tournament) {
            setLocalTournament(tournament);
        }
    }, [tournament]);
    if (!localTournament || !tournament || !organizers || !teams)
        return <div>Loading</div>;

    const canEdit =
        organizers.some((captain: User) => {
            captain.id === context.user?.id;
        }) || context.user?.admin;

    console.log("context :", context);

    console.log(canEdit);

    if (organizers && context.user !== undefined && !canEdit) router.push("/");

    return (
        <Box sx={{ p: "1rem" }}>
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

            <Link href={`/tournaments/${tournament.id}`} passHref>
                <Button startIcon={<ArrowBackIcon />}>Back</Button>
            </Link>
            <Typography variant="h4">
                Edit Tournament : {tournament.name}
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={currentTab}
                    onChange={(e, newValue) => setTab(newValue)}
                    aria-label="basic tabs example"
                    variant="fullWidth"
                >
                    <Tab label="Matches" />
                    <Tab label="Presentation" />
                    <Tab label="Teams" />
                    <Tab label="Organizers" />
                </Tabs>
            </Box>

            <TabPanel value={currentTab} index={0}>
                <Stack spacing={2} direction="row">
                    <Typography variant="h6">Matches</Typography>

                    {tournament.type == TournamentType.None ? (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleAddMatch}
                        >
                            <AddIcon />
                        </Button>
                    ) : (
                        <>
                            {tournament.status === TournamentStatus.Created && (
                                <Button
                                    size="small"
                                    onClick={handleGenerateMatches}
                                >
                                    Generate
                                </Button>
                            )}
                        </>
                    )}
                </Stack>

                <TableContainer component={Paper}>
                    <Table
                        aria-label="Matches table"
                        sx={{ minWidth: "50rem" }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Team 1</TableCell>
                                <TableCell>Team 2</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Winner</TableCell>
                                {tournament.type === TournamentType.None && (
                                    <TableCell></TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {matches
                                ?.sort((a, b) => {
                                    return a.id - b.id;
                                })
                                .map((match: Match) => (
                                    <TableRow
                                        key={match.id}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0,
                                                },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {match.id}
                                        </TableCell>
                                        <TableCell>
                                            <TeamSelector
                                                position="team1_id"
                                                teams={teamList}
                                                match={match}
                                                setMatch={handleUpdateMatch}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TeamSelector
                                                position="team2_id"
                                                teams={teamList}
                                                match={match}
                                                setMatch={handleUpdateMatch}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {match.date &&
                                                new Date(
                                                    match.date
                                                ).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">
                                                    Winner
                                                </InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={match.status}
                                                    label="Age"
                                                    onChange={(e) => {
                                                        console.log(
                                                            e.target.value
                                                        );

                                                        handleUpdateMatch({
                                                            ...match,
                                                            status: e.target
                                                                .value as MatchStatus,
                                                        });
                                                    }}
                                                >
                                                    <MenuItem value={0}>
                                                        None
                                                    </MenuItem>

                                                    {match.team1_id && (
                                                        <MenuItem value={1}>
                                                            {
                                                                teams.find(
                                                                    (t) =>
                                                                        t.team
                                                                            .id ===
                                                                        match.team1_id
                                                                )?.team.name
                                                            }
                                                        </MenuItem>
                                                    )}
                                                    {match.team2_id && (
                                                        <MenuItem value={2}>
                                                            {
                                                                teams.find(
                                                                    (t) =>
                                                                        t.team
                                                                            .id ===
                                                                        match.team2_id
                                                                )?.team.name
                                                            }
                                                        </MenuItem>
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        {tournament.type ===
                                            TournamentType.None && (
                                            <TableCell>
                                                <IconButton
                                                    onClick={() => {
                                                        handleDeleteMatch(
                                                            match
                                                        );
                                                    }}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
                <Typography variant="body1">
                    Type : {TournamentTypeName[tournament.type]}
                </Typography>
                <Stack spacing={2} sx={{ marginTop: "1rem" }}>
                    <TextField
                        fullWidth
                        value={localTournament?.name}
                        label="Name"
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) =>
                            setLocalTournament({
                                ...localTournament,
                                name: e.target.value,
                            })
                        }
                    />
                    <TextField
                        multiline
                        maxRows={10}
                        fullWidth
                        value={localTournament.description}
                        label="Description"
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => {
                            setLocalTournament({
                                ...localTournament,
                                description: e.target.value,
                            });
                        }}
                    />

                    <Box>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            {/* start_date  */}

                            <DatePicker
                                label="Start date"
                                views={["year", "month", "day"]}
                                value={localTournament.start_date}
                                onChange={(newValue) => {
                                    setLocalTournament({
                                        ...localTournament,
                                        start_date: newValue,
                                    });
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
                                value={localTournament.start_date}
                                onChange={(newValue) => {
                                    setLocalTournament({
                                        ...localTournament,
                                        end_date: newValue,
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        sx={{ width: "47%" }}
                                        {...params}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Box>

                    {/* game name */}

                    <TextField
                        fullWidth
                        value={localTournament.game_name}
                        label="Game name"
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) =>
                            setLocalTournament({
                                ...localTournament,
                                game_name: e.target.value,
                            })
                        }
                    />

                    {/* max teams */}
                    <TextField
                        fullWidth
                        value={localTournament.max_teams}
                        label="Max teams"
                        InputLabelProps={{ shrink: true }}
                        type="number"
                        onChange={(e) =>
                            setLocalTournament({
                                ...localTournament,
                                max_teams: parseInt(e.target.value, 10),
                            })
                        }
                        error={
                            localTournament.max_teams < 1 ||
                            isNaN(localTournament.max_teams)
                        }
                    />

                    <Box
                        sx={{
                            display: "flex",
                            flexFlow: "row",
                            flexWrap: "wrap",
                        }}
                    >
                        <Box sx={{ flexGrow: 1 }} />

                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                        <Button
                            sx={{ marginLeft: "1rem" }}
                            variant="contained"
                            color="primary"
                            onClick={handleApply}
                        >
                            Apply
                        </Button>
                    </Box>
                </Stack>
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
                <Stack spacing={2} direction="row">
                    <Typography variant="h6">Teams</Typography>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => setOpenAddTeamModal(true)}
                    >
                        <AddIcon />
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                            if (
                                tournament &&
                                context.tokenPair &&
                                context.setTokenPair
                            ) {
                                ShuffleTournamentTeams(
                                    tournament.id,
                                    context.tokenPair,
                                    context.setTokenPair
                                )
                                    .then(() => {
                                        setSuccessSnack("Teams shuffled");
                                        mutateTeams();
                                    })
                                    .catch((err: any) => {
                                        setErrorSnack(JSON.stringify(err));
                                        mutateTeams();
                                    });
                            }
                        }}
                    >
                        Shuffle
                    </Button>
                </Stack>
                <AddTeamModal
                    open={openAddTeamModal}
                    close={() => setOpenAddTeamModal(false)}
                    addTeams={handleAddTeams}
                    title="Add team(s)"
                />

                <Paper
                    elevation={3}
                    sx={{
                        maxWidth: "30rem",
                        padding: "0.5rem",
                        marginTop: "1rem",
                    }}
                >
                    {/* for consistancy */}
                    <Box
                        sx={{
                            borderBottom: "1px solid",
                            borderColor: "divider",
                        }}
                    />
                    <List sx={{ maxHeight: "60rem", overflowY: "auto", p: 0 }}>
                        {teams
                            .sort((a, b) => a.team_number - b.team_number)
                            .map((entry) => (
                                <ListItem
                                    sx={{
                                        borderBottom: "1px solid",
                                        borderColor: "divider",
                                    }}
                                    key={entry.team.id}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            color="error"
                                            onClick={() =>
                                                handleDeleteOrganizer(
                                                    entry.team.id
                                                )
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText primary={entry.team.name} />
                                </ListItem>
                            ))}
                    </List>
                </Paper>
            </TabPanel>
            <TabPanel value={currentTab} index={3}>
                <Stack spacing={2} direction="row">
                    <Typography variant="h6">Organizers</Typography>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => setOpenOrganizerModal(true)}
                    >
                        <AddIcon />
                    </Button>
                </Stack>
                <AddUserModal
                    open={openOrganizerModal}
                    close={() => setOpenOrganizerModal(false)}
                    addUsers={handleAddOrganizers}
                    title="Add Organizer(s)"
                />

                <Paper
                    elevation={3}
                    sx={{
                        maxWidth: "30rem",
                        padding: "0.5rem",
                        marginTop: "1rem",
                    }}
                >
                    {/* for consistancy */}
                    <Box
                        sx={{
                            borderBottom: "1px solid",
                            borderColor: "divider",
                        }}
                    />
                    <List sx={{ maxHeight: "60rem", overflowY: "auto", p: 0 }}>
                        {organizers.map((organizer: User) => (
                            <ListItem
                                sx={{
                                    borderBottom: "1px solid",
                                    borderColor: "divider",
                                }}
                                key={organizer.id}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        color="error"
                                        onClick={() =>
                                            handleDeleteOrganizer(organizer.id)
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText primary={organizer.username} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </TabPanel>
        </Box>
    );
};

export default TournamentEditor;
