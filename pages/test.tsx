import { Box } from "@mui/material";
import { NextPage } from "next";
import TeamSummary from "../components/TeamSummary";

const Test: NextPage = () => {
    return (
        <Box sx={{ maxWidth: "50rem", padding: "1em", display: "flex" }}>
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
    );
};

export default Test;
