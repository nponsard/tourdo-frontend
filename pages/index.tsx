import { Box, Tab, Tabs, TextField, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useState } from "react";
import { TabPanel } from "../components/TabPanel";
import SearchIcon from "@mui/icons-material/Search";
const Home: NextPage = () => {
    const [currentTab, setTab] = useState(0);
    const [search, setSearch] = useState("");

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

            <Typography variant="h4">Explore</Typography>
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField
                    id="search"
                    label="Search..."
                    variant="standard"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
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

            <TabPanel value={currentTab} index={0}></TabPanel>
            <TabPanel value={currentTab} index={1}></TabPanel>
            <TabPanel value={currentTab} index={2}></TabPanel>
        </>
    );
};

export default Home;
