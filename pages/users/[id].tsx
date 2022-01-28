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
import { Team } from "../../utils/teams";
import Link from "next/link";
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

const Tournament = () => {
    const router = useRouter();
    const { id } = router.query;
    const [currentTab, setTab] = useState(0);
    const context = useContext(LoginContext);

    const { data: user } = useGetUser(`${id}`);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const { data: teams } = useGetTeamsOfUser(`${id}`);

    if (!user) return <div>Loading</div>;

    return (
        <Box sx={{ p: "1rem" }}>
            <Typography variant="h4">
                {user.username}{" "}
                {user.admin && (
                    <Chip color="secondary" label="Admin" variant="outlined" />
                )}
            </Typography>

            <Typography variant="h5" sx={{ marginTop: "1rem" }}>
                Teams
            </Typography>

            {teams && (
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                    }}
                >
                    {teams.map((team: Team) => (
                        <Link key={team.id} href={`/teams/${team.id}`} passHref>
                            <Box sx={{ m: "1rem", cursor: "pointer" }}>
                                <TeamSummary team={team} />
                            </Box>
                        </Link>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default Tournament;
