import { Box, Tab, Tabs, TextField, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useState } from "react";
import { TabPanel } from "../components/TabPanel";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchTeams } from "../utils/teams";
import { useSearchUsers } from "../utils/users";
import { useSearchTournaments } from "../utils/tournaments";
import UserSummary from "../components/UserSummary";
import TeamSummary from "../components/TeamSummary";
import Tournament from "./tournaments/[id]";
import TournamentSummary from "../components/TournamentSummary";
import { PaginationManager } from "../components/PaginationManager";

const boxSx = {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
};

const pagination = 1;

const Home: NextPage = () => {
    const [currentTab, setTab] = useState(0);
    const [search, setSearch] = useState("");

    const [tournamentPage, setTournamentPage] = useState(1);
    const [teamPage, setTeamPage] = useState(1);
    const [userPage, setUserPage] = useState(1);

    const { data: teams } = useSearchTeams(
        search,
        (teamPage - 1) * pagination,
        pagination
    );
    const { data: users } = useSearchUsers(
        search,
        (userPage - 1) * pagination,
        pagination
    );
    const { data: tournaments } = useSearchTournaments(
        search,
        (tournamentPage - 1) * pagination,
        pagination
    );

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };
    return (
        <>
            <Typography variant="h2" sx={{ textAlign: "center" }}>
                Tournament Manager
            </Typography>
            <Typography
                variant="body1"
                sx={{ textAlign: "center", color: "text.secondary" }}
            >
                A simple tournament manager for the web
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginTop: "3rem",
                    flexWrap: "wrap",
                    marginBottom: "1rem",
                }}
            >
                <Typography variant="h4">Explore</Typography>
                <Box sx={{ flexGrow: 1, minWidth: "2rem" }}></Box>
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    <SearchIcon
                        sx={{ color: "action.active", mr: 1, my: 0.5 }}
                    />
                    <TextField
                        id="search"
                        label="Search..."
                        variant="standard"
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Box>
            </Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    aria-label="basic tabs example"
                    variant="fullWidth"
                >
                    <Tab label="Tournaments" />
                    <Tab label="Teams" />
                    <Tab label="Users" />
                </Tabs>
            </Box>

            <TabPanel value={currentTab} index={0}>
                <Box sx={boxSx}>
                    {tournaments && tournaments.tournaments.length > 0 && (
                        <>
                            {tournaments.tournaments.map((tournament) => (
                                <TournamentSummary
                                    key={tournament.id}
                                    tournament={tournament}
                                />
                            ))}
                        </>
                    )}
                </Box>
                <PaginationManager
                    currentPage={tournamentPage}
                    setCurrentPage={setTournamentPage}
                    total={tournaments?.total ?? 0}
                    pagination={pagination}
                />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <Box sx={boxSx}>
                    {teams && teams.teams.length > 0 && (
                        <>
                            {teams.teams.map((team) => (
                                <TeamSummary key={team.id} team={team} />
                            ))}
                        </>
                    )}
                </Box>
                <PaginationManager
                    currentPage={teamPage}
                    setCurrentPage={setTeamPage}
                    total={teams?.total ?? 0}
                    pagination={pagination}
                />
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
                <Box sx={boxSx}>
                    {users && users.users.length > 0 && (
                        <>
                            {users.users.map((user) => (
                                <UserSummary key={user.id} user={user} />
                            ))}
                        </>
                    )}
                </Box>
                <PaginationManager
                    pagination={pagination}
                    total={users?.total || 0}
                    currentPage={userPage}
                    setCurrentPage={setUserPage}
                />
            </TabPanel>
        </>
    );
};

export default Home;
