import { Box } from "@mui/material";
import { NextPage } from "next";
import MatchSummary from "../components/MatchSummary";
import Register from "./register";
import TeamSummary from "../components/TeamSummary";
import TournamentSummary from "../components/TournamentSummary";
import UserSummary from "../components/UserSummary";
import { PaginationManager } from "../components/PaginationManager";

const Test: NextPage = () => {
    return (
        <>
            <PaginationManager
                total={500}
                pagination={20}
                currentPage={20}
                setCurrentPage={() => {}}
            />
            <Register />
            <Box sx={{ maxWidth: "50rem", padding: "1em" }}>
                <Box sx={{ display: "flex" }}>
                    <TeamSummary
                        team={{
                            id: 0,
                            name: "The super team",
                            description: "very very long long long test desc",
                            match_count: 0,
                            win_count: 0,
                        }}
                    />
                    <TeamSummary
                        team={{
                            id: 0,
                            name: "The super team",
                            description: "very very long long long test desc",
                            match_count: 0,
                            win_count: 0,
                        }}
                    />
                    <TeamSummary
                        team={{
                            id: 0,
                            name: "The super team",
                            description: "very very long long long test desc",
                            match_count: 0,
                            win_count: 0,
                        }}
                    />
                    <TeamSummary
                        team={{
                            id: 0,
                            name: "The super team",
                            description: "very very long long long test desc",
                            match_count: 0,
                            win_count: 0,
                        }}
                    />
                </Box>
                <Box sx={{ display: "flex", marginTop: "1em" }}>
                    <UserSummary
                        user={{ id: 1, username: "sautax", admin: true }}
                    />

                    <UserSummary
                        user={{ id: 2, username: "toto", admin: false }}
                    />
                </Box>
                <Box sx={{ display: "flex", marginTop: "1em" }}></Box>
                <Box sx={{ display: "flex", marginTop: "1em" }}>
                    <MatchSummary
                        match={{
                            id: 1,
                            team1_id: 1,
                            team2_id: 2,
                            row: 1,
                            column: 1,
                            tournament_id: 1,
                            status: 1,
                            date: new Date(),
                        }}
                        teams={[
                            {
                                id: 1,
                                name: "Team 1",
                                description:
                                    "very very long long long test desc",
                                match_count: 0,
                                win_count: 0,
                            },
                            {
                                id: 2,
                                name: "The super team",
                                description:
                                    "very very long long long test desc",
                                match_count: 0,
                                win_count: 0,
                            },
                        ]}
                    />
                </Box>
            </Box>
        </>
    );
};

export default Test;
