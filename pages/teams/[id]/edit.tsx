import {
    Alert,
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
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
    EditTeam,
    Role,
    RoleNames,
    TeamMember,
    useGetTeam,
    useGetTeamMembers,
} from "../../../utils/teams";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
const TeamEditor = () => {
    const router = useRouter();
    const { id } = router.query;
    const context = useContext(LoginContext);

    const [localMembers, setLocalMembers] = useState<TeamMember[]>([]);
    const [localName, setLocalName] = useState("");
    const [localDescription, setLocalDescription] = useState("");
    const [errorSnack, setErrorSnack] = useState<string | undefined>();
    const [successSnack, setSuccessSnack] = useState<string | undefined>();

    const { data: team } = useGetTeam(`${id}`);
    const { data: members } = useGetTeamMembers(`${id}`);

    useEffect(() => {
        if (team) {
            setLocalName(team.name);
            setLocalDescription(team.description);
        }
    }, [team]);

    useEffect(() => {
        if (members !== undefined) {
            setLocalMembers(members);
        }
    }, [members]);

    const handleApply = useCallback(() => {
        if (team && context.tokenPair && context.setTokenPair) {
            EditTeam(
                team.id,
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
    }, [localDescription, localName, team, context]);
    const handleReset = useCallback(() => {
        if (team) {
            setLocalName(team.name);
            setLocalDescription(team.description);
        }
    }, [team]);
    if (!team || !members) return <div>Loading</div>;

    const canEdit =
        members.some((captain: TeamMember) => {
            captain.user.id === context.user?.id &&
                captain.role === Role.LEADER;
        }) || context.user?.admin;

    console.log("context :", context);

    console.log(canEdit);

    if (members && context.user !== undefined && !canEdit) router.push("/");

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
                    Organizers successufuly modified
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
                    An error occured
                </Alert>
            </Snackbar>
            <Typography variant="h4">Edit team</Typography>
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
            <Typography variant="h6">Members</Typography>
            TODO : implement actions
            <Button color="success" variant="contained">
                Add
            </Button>
            <Paper elevation={3} sx={{ maxWidth: "30rem" }}>
                <List>
                    {localMembers.map((member: TeamMember) => (
                        <ListItem
                            key={member.user.id}
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText
                                primary={member.user.username}
                                secondary={RoleNames[member.role]}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default TeamEditor;
