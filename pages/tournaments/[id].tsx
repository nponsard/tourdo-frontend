import { Box } from "@mui/material";
import { FetchEvent } from "next/dist/server/web/spec-compliant/fetch-event";
import { useRouter } from "next/router";
import { FetchTournament } from "../../types/tournaments";
import useSWR from "swr";
const Tournament = () => {
    const router = useRouter();
    const { id: tournamentID } = router.query;

    const { data, error } = useSWR(`${tournamentID}`, FetchTournament);

    return (
        <>
            <Box>
                <h1>Tournament {tournamentID}</h1>
            </Box>
        </>
    );
};

export default Tournament;
