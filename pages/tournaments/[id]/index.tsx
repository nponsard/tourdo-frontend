import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import MatchSummary from "../../../components/MatchSummary";
import TeamSummary from "../../../components/TeamSummary";
import TournamentRepresentation from "../../../components/TournamentRepresentation";
import UserSummary from "../../../components/UserSummary";
import { LoginContext } from "../../../utils/auth";
import {
    FetchDeleteTournament,
    TournamentTypeName,
    useGetTournament as useGetTournament,
    useGetTournamentMatches,
    useGetTournamentOrganizers,
    useGetTournamentTeams,
} from "../../../utils/tournaments";
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

const boxSx = {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
};

const Tournament = () => {
    const router = useRouter();
    const { id: tournamentID } = router.query;
    const [currentTab, setTab] = useState(0);
    const context = useContext(LoginContext);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const { user } = useContext(LoginContext);

    const { data: tournament, error } = useGetTournament(`${tournamentID}`);

    const { data: organizers } = useGetTournamentOrganizers(`${tournamentID}`);

    const { data: matches, error: matchesError } = useGetTournamentMatches(`${tournamentID}`);
    const { data: teams, error: teamsError } = useGetTournamentTeams(`${tournamentID}`);

    const teamList = teams?.map((team) => team.team) ?? [];
    const smallScreen = useMediaQuery("(max-width:25rem)");

    if (!tournament) {
        return <div>Loading...</div>;
    }

    const canEdit = user && ((organizers && organizers.some((organizer) => organizer.id === user.id)) || user.admin);

    return (
        <>
            <Box sx={{ p: { xs: "0.2rem", sm: "0.5rem", md: "1rem" } }}>
                <Box>
                    <Typography variant="body1" color="text.secondary">
                        Tournament
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap-reverse",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h2">{tournament?.name}</Typography>

                        <Box sx={{ flexGrow: 1 }} />
                        <Box>
                            {canEdit && (
                                <Button
                                    variant="outlined"
                                    startIcon={<DeleteIcon />}
                                    color="error"
                                    onClick={() => {
                                        if (context.tokenPair && context.setTokenPair)
                                            FetchDeleteTournament(
                                                tournament.id,
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
                                <Link href={`/tournaments/${tournament.id}/edit`} passHref>
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
                    <Typography variant="body1">Type : {TournamentTypeName[tournament.type]}</Typography>
                    <Typography color="text.secondary">{tournament?.description}</Typography>
                    <Typography>
                        {tournament.start_date && tournament.end_date ? (
                            <>
                                {new Date(tournament.start_date).toLocaleDateString()} -
                                {new Date(tournament.end_date).toLocaleDateString()}
                            </>
                        ) : (
                            <>No date specified</>
                        )}{" "}
                        | {tournament.max_teams} teams | Game : {tournament.game_name}
                    </Typography>
                </Box>
                <Box>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                            value={currentTab}
                            onChange={handleTabChange}
                            aria-label="select what do you  want to see"
                            scrollButtons="auto"
                            variant={smallScreen ? "scrollable" : "fullWidth"}
                        >
                            <Tab label="Preview" />
                            <Tab label="Teams" />
                            <Tab label="Matches" />
                            <Tab label="Organizers" />
                        </Tabs>
                    </Box>

                    <TabPanel value={currentTab} index={0}>
                        {matches ? (
                            <TournamentRepresentation matches={matches} tournament={tournament} teams={teamList} />
                        ) : (
                            <div>No matches</div>
                        )}
                    </TabPanel>
                    <TabPanel value={currentTab} index={1}>
                        <Box sx={boxSx}>
                            {teams?.map((entry) => (
                                <TeamSummary key={entry.team.id} team={entry.team} />
                            ))}
                        </Box>
                    </TabPanel>
                    <TabPanel value={currentTab} index={2}>
                        <Box sx={boxSx}>
                            {teams &&
                                matches?.map((entry) => <MatchSummary teams={teamList} match={entry} key={entry.id} />)}
                        </Box>
                    </TabPanel>
                    <TabPanel value={currentTab} index={3}>
                        <Box sx={boxSx}>
                            {organizers?.map((user) => (
                                <UserSummary key={user.id} user={user} />
                            ))}
                        </Box>
                    </TabPanel>
                </Box>
            </Box>
        </>
    );
};

export default Tournament;
