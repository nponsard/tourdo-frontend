import { LoadingButton } from "@mui/lab";
import { Box, Button, List, ListItem, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { LoginContext } from "../utils/auth";
import { CreateEmptyTeam } from "../utils/teams";

export default function QuickTeamCreation() {
    const context = useContext(LoginContext);
    const router = useRouter();

    const [teamName, setTeamName] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const [log, setLog] = React.useState<string[]>([]);

    if ((context.user && !context.user.admin) || context.user === null) return router.push("/");

    const handleTeamChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const newTeams = [...log];
        newTeams[index] = event.target.value;

        if (index === log.length - 1 && event.target.value !== "") newTeams.push("");

        setLog(newTeams);
    };

    const createTeam = (name: string) => {
        if (name === "") return;

        if (context.tokenPair && context.setTokenPair)
            CreateEmptyTeam(teamName, "Quick team", context.tokenPair, context.setTokenPair)
                .then((value) => {
                    setLog([...log, `Team ${value.name} created`]);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLog((prev) => [...prev, `Error creating team ${name} : ${JSON.stringify(error)}`]);
                })
                .finally(() => setLoading(false));
    };

    const handleAdd = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setLoading(true);
        createTeam(teamName);
        setTeamName("");
    };

    return (
        <Box>
            <Typography variant="h4">Quick Team Creation</Typography>

            <List>
                {log.map((line, index) => (
                    <ListItem key={index}>
                        <Typography variant="body1">{line}</Typography>
                    </ListItem>
                ))}
            </List>
            <form>
                <TextField
                    label="Team Name"
                    variant="outlined"
                    value={teamName}
                    onChange={(event) => setTeamName(event.target.value)}
                />
                <LoadingButton loading={loading} type="submit" variant="contained" onClick={handleAdd}>
                    Add Team
                </LoadingButton>
            </form>
        </Box>
    );
}
