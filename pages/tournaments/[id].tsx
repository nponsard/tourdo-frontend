import {
    Box,
    Button,
    Divider,
    Paper,
    Skeleton,
    Typography,
} from "@mui/material";
import { FetchEvent } from "next/dist/server/web/spec-compliant/fetch-event";
import { useRouter } from "next/router";
import {
    FetchTournament,
    FetchTournamentMatches,
    FetchTournamentOrganizers,
    FetchTournamentTeams,
} from "../../types/tournaments";
import useSWR from "swr";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import TournamentRepresentation from "../../components/TournamentRepresentation";
import TeamSummary from "../../components/TeamSummary";
import MatchSummary from "../../components/MatchSummary";
import UserSummary from "../../components/UserSummary";
import OrganizerManager from "../../components/OrganizerManager";
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
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const Tournament = () => {
    const router = useRouter();
    const { id: tournamentID } = router.query;
    const [currentTab, setTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const { data: tournament, error } = FetchTournament(`${tournamentID}`);

    const { data: organizers } = FetchTournamentOrganizers(`${tournamentID}`);

    const { data: matches, error: matchesError } = FetchTournamentMatches(
        `${tournamentID}`
    );
    const { data: teams, error: teamsError } = FetchTournamentTeams(
        `${tournamentID}`
    );

    if (!tournament) {
        return <div>Loading...</div>;
    }

    const canEdit = true; // TODO  use context

    return (
        <>
            <Typography>{JSON.stringify(tournament)}</Typography>

            <Box sx={{ padding: "1em", m: "1em" }}>
                <Box>
                    <Typography variant="h2">{tournament?.name}</Typography>
                    <Typography color="text.secondary">
                        {tournament?.description}
                    </Typography>
                    <Typography>
                        {new Date(tournament.start_date).toLocaleDateString()} -{" "}
                        {new Date(tournament.end_date).toLocaleDateString()}
                    </Typography>
                    <Typography>{tournament.game_name}</Typography>
                </Box>
                <Box>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                            value={currentTab}
                            onChange={handleTabChange}
                            aria-label="basic tabs example"
                            variant="fullWidth"
                        >
                            <Tab label="Preview" />
                            <Tab label="Teams" />
                            <Tab label="Matches" />
                            <Tab label="Organizers" />
                        </Tabs>
                    </Box>

                    <TabPanel value={currentTab} index={0}>
                        <TournamentRepresentation
                            matches={matches}
                            tournament={tournament}
                        />
                    </TabPanel>
                    <TabPanel value={currentTab} index={1}>
                        {teams?.map((entry) => (
                            <TeamSummary
                                key={entry.team.id}
                                team={entry.team}
                            />
                        ))}
                    </TabPanel>
                    <TabPanel value={currentTab} index={2}>
                        {teams &&
                            matches?.map((entry) => (
                                <MatchSummary
                                    teams={teams?.map((entry) => entry.team)}
                                    match={entry}
                                    key={entry.id}
                                />
                            ))}
                    </TabPanel>
                    <TabPanel value={currentTab} index={3}>
                        <OrganizerManager
                            organizers={organizers}
                            removeOrganizer={
                                canEdit ? (id: number) => {} : undefined
                            }
                            addOrganizer={
                                canEdit ? (id: number) => {} : undefined
                            }
                        />
                    </TabPanel>
                </Box>
            </Box>
        </>
    );
};

export default Tournament;
