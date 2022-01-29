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
import { User } from "../../utils/users";
import { LoginContext } from "../../utils/auth";
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

    const { data: tournament, error } = FetchTournament(`${tournamentID}`);

    const { data: organizers } = FetchTournamentOrganizers(`${tournamentID}`);

    const { data: matches, error: matchesError } = FetchTournamentMatches(
        `${tournamentID}`
    );
    const { data: teams, error: teamsError } = FetchTournamentTeams(
        `${tournamentID}`
    );

    const teamsList = teams?.map((team) => team.team) ?? [];

    if (!tournament) {
        return <div>Loading...</div>;
    }

    const canEdit =
        user?.admin ||
        organizers?.some((val) => {
            user?.id == val.id;
        });

    const removeOrganizer = canEdit
        ? async (user: User) => {
              console.log(user);
              if (context.tokenPair && context.setTokenPair) {
                  await RemoveTournamentOrganizer(
                      tournament.id,
                      user.id,
                      context.tokenPair,
                      context.setTokenPair
                  );
                  organizers?.filter((predicate) => predicate.id !== user.id);
              }
          }
        : undefined;

    console.log(removeOrganizer);
    const addOrganizer = canEdit
        ? async (user: User) => {
              if (context.tokenPair && context.setTokenPair) {
                  await AddTournamentOrganizer(
                      tournament.id,
                      user.id,
                      context.tokenPair,
                      context.setTokenPair
                  );
                  organizers?.push(user);
              }
          }
        : undefined;

    return (
        <>
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
                        <Box sx={boxSx}>
                            {teams?.map((entry) => (
                                <TeamSummary
                                    key={entry.team.id}
                                    team={entry.team}
                                />
                            ))}
                        </Box>
                    </TabPanel>
                    <TabPanel value={currentTab} index={2}>
                        <Box sx={boxSx}>
                            {teams &&
                                matches?.map((entry) => (
                                    <MatchSummary
                                        teams={teamsList}
                                        match={entry}
                                        key={entry.id}
                                    />
                                ))}
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
