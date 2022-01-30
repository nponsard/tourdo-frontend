import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Modal,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import UserSummary from "../../../components/UserSummary";
import { LoginContext } from "../../../utils/auth";
import {
    AddTeamMember,
    EditTeam,
    TeamRole,
    TeamRoleNames,
    TeamMember,
    useGetTeam,
    useGetTeamMembers,
    RemoveTeamMember,
} from "../../../utils/teams";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { User } from "../../../utils/users";
import AddUserModal from "../../../components/AddUserModal";
import {
    AddTournamentOrganizer,
    RemoveTournamentOrganizer,
    useGetTournament,
    useGetTournamentOrganizers,
} from "../../../utils/tournaments";

const TournamentEditor = () => {
    const router = useRouter();
    const { id } = router.query;
    const context = useContext(LoginContext);

    // const [localMembers, setLocalMembers] = useState<TeamMember[]>([]);
    const [localName, setLocalName] = useState("");
    const [localDescription, setLocalDescription] = useState("");
    const [errorSnack, setErrorSnack] = useState<string | undefined>();
    const [successSnack, setSuccessSnack] = useState<string | undefined>();
    const [openOrganizerModal, setOpenOrganizerModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<TeamRole>(TeamRole.PLAYER);

    const { data: organizers, mutate: mutateOrganizers } =
        useGetTournamentOrganizers(`${id}`);
    const { data: tournament, mutate: mutateTournament } = useGetTournament(
        `${id}`
    );

    useEffect(() => {
        if (tournament) {
            setLocalName(tournament.name);
            setLocalDescription(tournament.description);
        }
    }, [tournament]);

    const handleApply = useCallback(() => {
        if (tournament && context.tokenPair && context.setTokenPair) {
            EditTournament(
                tournament.id,
                localName,
                localDescription,
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
    }, [localDescription, localName, tournament, context]);

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
                        mutateOrganizers()
                    })
                    .catch((e) => {
                        if (e.message && typeof e.message === "string")
                            setErrorSnack(e.message);
                        else setErrorSnack(JSON.stringify(e));
                        mutateOrganizers()
                    
                    });
            }
        },
        [context.setTokenPair, context.tokenPair, mutateOrganizers, tournament]
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

    const handleReset = useCallback(() => {
        if (tournament) {
            setLocalName(tournament.name);
            setLocalDescription(tournament.description);
        }
    }, [tournament]);
    if (!tournament || !organizers) return <div>Loading</div>;

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
            <Typography variant="h4">Edit Tournament</Typography>
            <Stack spacing={2}>
                <TextField
                    fullWidth
                    value={localName}
                    label="Name"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setLocalName(e.target.value)}
                />
                <TextField
                    multiline
                    maxRows={10}
                    fullWidth
                    value={localDescription}
                    label="Description"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setLocalDescription(e.target.value)}
                />
                {/* TODO :  */}
                {/* dates */}
                {/* game name */}
                {/* max teams */}

                <Box
                    sx={{ display: "flex", flexFlow: "row", flexWrap: "wrap" }}
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
                sx={{ maxWidth: "30rem", padding: "0.5rem", marginTop: "1rem" }}
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
        </Box>
    );
};

export default TournamentEditor;
