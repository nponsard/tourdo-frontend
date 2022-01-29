import {
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import UserSummary from "../../../components/UserSummary";
import { LoginContext } from "../../../utils/auth";
import {
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
            <Typography variant="h4">Edit team</Typography>
            <Stack spacing={2}>
                <TextField
                    fullWidth
                    value={localName}
                    label="Name"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    value={localDescription}
                    label="Description"
                    InputLabelProps={{ shrink: true }}
                />
            </Stack>
            <Typography variant="body1">{team.description}</Typography>
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
