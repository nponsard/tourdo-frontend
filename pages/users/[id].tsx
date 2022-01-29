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
const boxSx = {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
};

const UserDetail = () => {
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
                <Box sx={boxSx}>
                    {teams.map((team: Team) => (
                        <TeamSummary key={team.id} team={team} />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default UserDetail;