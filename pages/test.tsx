import { Box } from "@mui/material";
import { NextPage } from "next";
import TeamSummary from "../components/TeamSummary";
import UserSummary from "../components/UserSummary";

const Test: NextPage = () => {
    return (
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

                <UserSummary user={{ id: 2, username: "toto", admin: false }} />
            </Box>
        </Box>
    );
};

export default Test;
