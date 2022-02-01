import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
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
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import AddUserModal from "../../../components/AddUserModal";
import GenericSnackBar from "../../../components/GenericSnackBar";
import { LoginContext } from "../../../utils/auth";
import {
    FetchAddTeamMember,
    FetchEditTeam,
    FetchRemoveTeamMember,
    TeamMember,
    TeamRole,
    TeamRoleNames,
    useGetTeam,
    useGetTeamMembers,
} from "../../../utils/teams";
import { User } from "../../../utils/users";

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

    const handleAddMembers = useCallback(
        (users: User[]) => {
            const promises = users.map((user) => {
                if (team && context.tokenPair && context.setTokenPair) {
                    return FetchAddTeamMember(team.id, user.id, selectedRole, context.tokenPair, context.setTokenPair);
                }
            });

            Promise.allSettled(promises)
                .then((results) => {
                    if (results.some((result) => result.status === "rejected")) {
                        setErrorSnack("Failed to add some users");
                        console.log(results);
                    } else setSuccessSnack("User(s) added successfully");
                })
                .catch((e) => {
                    if (e.message) setErrorSnack(e.message);
                    else setErrorSnack(JSON.stringify(e));
                })
                .finally(() => {
                    mutateMembers();
                });
        },
        [team, context, selectedRole, mutateMembers]
    );

    const handleApply = useCallback(() => {
        if (team && context.tokenPair && context.setTokenPair) {
            FetchEditTeam(team.id, localName, localDescription, context.tokenPair, context.setTokenPair)
                .then(() => {
                    setSuccessSnack("Team edited successfully");
                })
                .catch((e) => {
                    if (e.message && typeof e.message === "string") setErrorSnack(e.message);
                    else setErrorSnack(JSON.stringify(e));
                });
        }
    }, [localDescription, localName, team, context]);

    const handleDelete = useCallback(
        (userID: number) => {
            if (team && context.tokenPair && context.setTokenPair) {
                FetchRemoveTeamMember(team.id, userID, context.tokenPair, context.setTokenPair)
                    .then(() => {
                        setSuccessSnack("Team member removed successfully");
                    })
                    .catch((e) => {
                        if (e.message && typeof e.message === "string") setErrorSnack(e.message);
                        else setErrorSnack(JSON.stringify(e));
                    })
                    .finally(() => {
                        mutateMembers();
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
    if (team === undefined || members === undefined) return <div>Loading</div>;

    const canEdit =
        context.user &&
        ((members &&
            members.some((member) => member.user.id === context.user?.id && member.role === TeamRole.LEADER)) ||
            context.user.admin);

    if (!canEdit) {
        router.push("/");
        return <></>;
    }

    return (
        <Box sx={{ p: { xs: "0.2rem", sm: "0.5rem", md: "1rem" } }}>
            <GenericSnackBar message={successSnack} setMessage={setSuccessSnack} severity="success" />
            <GenericSnackBar message={errorSnack} setMessage={setErrorSnack} severity="error" />

            <Link href={`/teams/${team.id}`} passHref>
                <Button startIcon={<ArrowBackIcon />}>Back</Button>
            </Link>

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

                <Box sx={{ display: "flex", flexFlow: "row", flexWrap: "wrap" }}>
                    <Box sx={{ flexGrow: 1 }} />

                    <Button variant="contained" color="secondary" onClick={handleReset}>
                        Reset
                    </Button>
                    <Button sx={{ marginLeft: "1rem" }} variant="contained" color="primary" onClick={handleApply}>
                        Apply
                    </Button>
                </Box>
            </Stack>
            <Typography variant="h6">Members</Typography>
            <AddUserModal
                open={openModal}
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
            <Paper elevation={3} sx={{ maxWidth: "30rem", padding: "0.5rem", marginTop: "1rem" }}>
                {/* for consistancy */}
                <Box
                    sx={{
                        borderBottom: "1px solid",
                        borderColor: "palette.divider",
                    }}
                />
                <List sx={{ maxHeight: "60rem", overflowY: "auto", p: 0 }}>
                    {members.map((member: TeamMember) => (
                        <ListItem
                            sx={{
                                borderBottom: "1px solid",
                                borderColor: "palette.divider",
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
                            <ListItemText primary={member.user.username} secondary={TeamRoleNames[member.role]} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default TeamEditor;
