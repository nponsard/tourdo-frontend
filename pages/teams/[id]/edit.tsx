import {
    Alert,
    Autocomplete,
    Box,
    Button,
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

const TeamEditor = () => {
    const router = useRouter();
    const { id } = router.query;
    const context = useContext(LoginContext);

    // const [localMembers, setLocalMembers] = useState<TeamMember[]>([]);
    const [localName, setLocalName] = useState("");
    const [localDescription, setLocalDescription] = useState("");
    const [errorSnack, setErrorSnack] = useState<string | undefined>();
    const [successSnack, setSuccessSnack] = useState<string | undefined>();
    const [openModal, setOpenModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<TeamRole>(TeamRole.PLAYER);

    const { data: team } = useGetTeam(`${id}`);
    const { data: members, mutate: mutateMembers } = useGetTeamMembers(`${id}`);

    useEffect(() => {
        if (team) {
            setLocalName(team.name);
            setLocalDescription(team.description);
        }
    }, [team]);

    /*
    useEffect(() => {
        if (members !== undefined) {
            setLocalMembers(members);
        }
    }, [members]);
*/
    const handleAddMembers = useCallback(
        (users: User[]) => {
            const promises = users.map((user) => {
                if (team && context.tokenPair && context.setTokenPair) {
                    return AddTeamMember(
                        team.id,
                        user.id,
                        selectedRole,
                        context.tokenPair,
                        context.setTokenPair
                    );
                }
            });

            Promise.allSettled(promises)
                .then(() => {
                    setSuccessSnack("Successfully added members");
                    mutateMembers();
                })
                .catch((e) => {
                    mutateMembers();
                    if (e.message) setErrorSnack(e.message);
                    else setErrorSnack(JSON.stringify(e));
                });
        },
        [team, context, selectedRole, mutateMembers]
    );

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

    const handleDelete = useCallback(
        (user_id: number) => {
            if (team && context.tokenPair && context.setTokenPair) {
                RemoveTeamMember(
                    team.id,
                    user_id,
                    context.tokenPair,
                    context.setTokenPair
                )
                    .then(() => {
                        setSuccessSnack("Team member removed successfully");
                        mutateMembers();
                    })
                    .catch((e) => {
                        if (e.message && typeof e.message === "string")
                            setErrorSnack(e.message);
                        else setErrorSnack(JSON.stringify(e));
                    });
            }
        },
        [team, context, mutateMembers]
    );

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
                captain.role === TeamRole.LEADER;
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
            <AddUserModal
                show={openModal}
                close={() => {
                    setOpenModal(false);
                }}
                addUsers={handleAddMembers}
                title={"Add " + TeamRoleNames[selectedRole]}
            />

            <Stack spacing={2} direction="row">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                        setSelectedRole(TeamRole.PLAYER);
                        setOpenModal(true);
                    }}
                >
                    Add player
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                        setSelectedRole(TeamRole.COACH);
                        setOpenModal(true);
                    }}
                >
                    Add coach
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                        setSelectedRole(TeamRole.LEADER);
                        setOpenModal(true);
                    }}
                >
                    Add captain
                </Button>
            </Stack>
            <Paper
                elevation={3}
                sx={{ maxWidth: "30rem", padding: "0.5rem", marginTop: "1rem" }}
            >
                <List>
                    {members.map((member: TeamMember) => (
                        <ListItem
                            sx={{
                                borderTop: "1px solid",
                                borderBottom: "1px solid",
                                borderColor: "divider",
                            }}
                            key={member.user.id}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    color="error"
                                    onClick={() => handleDelete(member.user.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText
                                primary={member.user.username}
                                secondary={TeamRoleNames[member.role]}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default TeamEditor;
