import {
    Badge,
    Box,
    Button,
    Chip,
    Divider,
    Paper,
    Skeleton,
    Typography,
} from "@mui/material";
import { FetchEvent } from "next/dist/server/web/spec-compliant/fetch-event";
import { useRouter } from "next/router";
import {
    AddTournamentOrganizer,
    FetchTournament,
    FetchTournamentMatches,
    FetchTournamentOrganizers,
    FetchTournamentTeams,
    RemoveTournamentOrganizer,
} from "../../utils/tournaments";
import useSWR from "swr";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useContext, useState } from "react";
import TournamentRepresentation from "../../components/TournamentRepresentation";
import TeamSummary from "../../components/TeamSummary";
import MatchSummary from "../../components/MatchSummary";
import UserSummary from "../../components/UserSummary";
import OrganizerManager from "../../components/OrganizerManager";
import { useGetTeamsOfUser, useGetUser, User } from "../../utils/users";
import { LoginContext } from "../../utils/auth";
import {
    DeleteTeam,
    Role,
    Team,
    TeamMember,
    useGetTeam,
    useGetTeamMembers,
    useGetTeamTournaments,
} from "../../utils/teams";
import Link from "next/link";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

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
    // const { data: tournaments } = useGetTeamTournaments(`${id}`);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    if (!team || !members) return <div>Loading</div>;

    const captains = members.filter(
        (member: TeamMember) => member.role == Role.LEADER
    );
    const coaches = members.filter(
        (member: TeamMember) => member.role == Role.COACH
    );
    const players = members.filter(
        (member: TeamMember) => member.role == Role.PLAYER
    );

    const canEdit =
        captains.some((captain: TeamMember) => {
            captain.user.id == context.user?.id;
        }) || context.user?.admin;

    return (
        <Box sx={{ p: "1rem" }}>
            <Box
                sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
            >
                <Typography variant="h4">{team.name}</Typography>
                <Box sx={{ flexGrow: 1 }} />
                {canEdit && (
                    <Button
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        color="error"
                        onClick={() => {
                            if (context.tokenPair && context.setTokenPair)
                                DeleteTeam(
                                    team.id,
                                    context.tokenPair,
                                    context.setTokenPair
                                )
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
            <Typography variant="body1">{team.description}</Typography>
            <Typography variant="body1">
                {team.win_count} Wins on {team.match_count} matches played
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    aria-label="basic tabs example"
                    variant="fullWidth"
                >
                    <Tab label="Members" />
                    <Tab label="Tournaments" />
                </Tabs>
            </Box>

            <TabPanel value={currentTab} index={0}>
                {captains.length > 0 && (
                    <>
                        <Typography
                            variant="h5"
                            sx={{ textAlign: "center", marginTop: "1rem" }}
                        >
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
                                <UserSummary
                                    key={captain.user.id}
                                    user={captain.user}
                                />
                            ))}
                        </Box>
                    </>
                )}
                {coaches.length > 0 && (
                    <>
                        <Typography
                            variant="h5"
                            sx={{ textAlign: "center", marginTop: "1rem" }}
                        >
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
                                <UserSummary
                                    key={member.user.id}
                                    user={member.user}
                                />
                            ))}
                        </Box>
                    </>
                )}

                {players.length > 0 && (
                    <>
                        <Typography
                            variant="h5"
                            sx={{ textAlign: "center", marginTop: "1rem" }}
                        >
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
                                <UserSummary
                                    key={member.user.id}
                                    user={member.user}
                                />
                            ))}
                        </Box>
                    </>
                )}
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                TODO : create and use the api
            </TabPanel>
        </Box>
    );
};

export default TeamDetail;
