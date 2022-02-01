import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import TournamentSummary from "../../../components/TournamentSummary";
import UserSummary from "../../../components/UserSummary";
import { LoginContext } from "../../../utils/auth";
import {
    FetchDeleteTeam,
    TeamMember,
    TeamRole,
    useGetTeam,
    useGetTeamMembers,
    useGetTeamTournaments,
} from "../../../utils/teams";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
const boxSx = {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
};

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const TeamDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [currentTab, setTab] = useState(0);
    const context = useContext(LoginContext);

    const { data: team } = useGetTeam(`${id}`);
    const { data: members } = useGetTeamMembers(`${id}`);
    const { data: tournaments } = useGetTeamTournaments(`${id}`);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    if (!team || !members) return <div>Loading</div>;

    const captains = members.filter((member: TeamMember) => member.role == TeamRole.LEADER);
    const coaches = members.filter((member: TeamMember) => member.role == TeamRole.COACH);
    const players = members.filter((member: TeamMember) => member.role == TeamRole.PLAYER);

    const canEdit =
        context.user &&
        ((members &&
            members.some((member) => member.user.id === context.user?.id && member.role === TeamRole.LEADER)) ||
            context.user.admin);

    return (
        <Box sx={{ p: { xs: "0.2rem", sm: "0.5rem", md: "1rem" } }}>
            <Typography variant="body1" color="text.secondary">
                Team
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap-reverse",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4">{team.name}</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box>
                    {canEdit && (
                        <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            color="error"
                            onClick={() => {
                                if (context.tokenPair && context.setTokenPair)
                                    FetchDeleteTeam(team.id, context.tokenPair, context.setTokenPair)
                                        .then(() => router.push("/"))
                                        .catch(console.error);
                            }}
                        >
                            Delete
                        </Button>
                    )}
                    {canEdit && (
                        <Link href={`/teams/${team.id}/edit`} passHref>
                            <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                color="primary"
                                sx={{ marginLeft: "1rem" }}
                            >
                                Edit
                            </Button>
                        </Link>
                    )}
                </Box>
            </Box>
            <Typography variant="body1">{team.description}</Typography>
            <Typography variant="body1">
                {team.win_count} Wins on {team.match_count} matches played
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    aria-label="Select a tab to see the team's members or tournaments"
                    variant="fullWidth"
                >
                    <Tab label="Members" />
                    <Tab label="Tournaments" />
                </Tabs>
            </Box>

            <TabPanel value={currentTab} index={0}>
                {captains.length > 0 && (
                    <>
                        <Typography variant="h5" sx={{ textAlign: "center", marginTop: "1rem" }}>
                            Captain{captains.length > 1 ? "s" : ""}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-evenly",
                            }}
                        >
                            {captains.map((captain: TeamMember) => (
                                <UserSummary key={captain.user.id} user={captain.user} />
                            ))}
                        </Box>
                    </>
                )}
                {coaches.length > 0 && (
                    <>
                        <Typography variant="h5" sx={{ textAlign: "center", marginTop: "1rem" }}>
                            Coach{captains.length > 1 ? "es" : ""}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-evenly",
                            }}
                        >
                            {coaches.map((member: TeamMember) => (
                                <UserSummary key={member.user.id} user={member.user} />
                            ))}
                        </Box>
                    </>
                )}

                {players.length > 0 && (
                    <>
                        <Typography variant="h5" sx={{ textAlign: "center", marginTop: "1rem" }}>
                            Player{captains.length > 1 ? "s" : ""}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-evenly",
                            }}
                        >
                            {players.map((member: TeamMember) => (
                                <UserSummary key={member.user.id} user={member.user} />
                            ))}
                        </Box>
                    </>
                )}
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <Box sx={boxSx}>
                    {tournaments && tournaments.length > 0 && (
                        <>
                            {tournaments.map((tournament) => (
                                <TournamentSummary key={tournament.id} tournament={tournament} />
                            ))}
                        </>
                    )}
                </Box>
            </TabPanel>
        </Box>
    );
};

export default TeamDetail;
