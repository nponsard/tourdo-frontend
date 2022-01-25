import { Box, Divider, Paper, Skeleton, Typography } from "@mui/material";
import { FetchEvent } from "next/dist/server/web/spec-compliant/fetch-event";
import { useRouter } from "next/router";
import { FetchTournament } from "../../types/tournaments";
import useSWR from "swr";
import { typography } from "@mui/system";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
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
    const [currentTab, setTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };
    const router = useRouter();
    const { id: tournamentID } = router.query;

    const { data: tournament, error } = useSWR(
        `${tournamentID}`,
        FetchTournament
    );

    if (!tournament) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Typography>{JSON.stringify(tournament)}</Typography>

            <Paper elevation={3} sx={{ padding: "1em", m: "1em" }}>
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
                        </Tabs>
                    </Box>

                    <TabPanel value={currentTab} index={0}>
                        Item One
                    </TabPanel>
                    <TabPanel value={currentTab} index={1}>
                        Item Two
                    </TabPanel>
                    <TabPanel value={currentTab} index={2}>
                        Item Three
                    </TabPanel>
                </Box>
            </Paper>
        </>
    );
};

export default Tournament;
