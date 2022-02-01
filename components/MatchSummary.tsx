import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Match } from "../utils/matches";
import { Team } from "../utils/teams";

const MiniTeam = ({
    team,
    team_number,
    match_status,
}: {
    team: Team | undefined;
    team_number: number;
    match_status: number;
}) => {
    return (
        <Box sx={{ display: "flex" }}>
            <Typography
                component="div"
                sx={{
                    overflowX: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "clip",
                    fontStyle: team ? "normal" : "italic",
                }}
                color={team_number === match_status ? "text.primary" : "text.secondary"}
            >
                {team ? team.name : "TBD"}
            </Typography>
            <Box sx={{ flexGrow: 1, minWidth: "1em" }} />
            {match_status >= 1 &&
                match_status <= 2 &&
                (match_status === team_number ? <CheckIcon color="success" /> : <CloseIcon color="error" />)}
        </Box>
    );
};

const MatchSummary = ({ match, teams }: { match: Match; teams: Team[] }) => {
    let team1 = teams.find((t) => t.id === match.team1_id);
    let team2 = teams.find((t) => t.id === match.team2_id);

    console.log(teams);

    /*

    if (team1 === undefined || team2 === undefined) {
        return (
            <Paper elevation={3} sx={{ width: "20em", p: "0.5rem" }}></Paper>
        );
    }*/

    return (
        <Paper elevation={3} sx={{ width: "20em", p: "0.5rem", m: "1rem" }}>
            <MiniTeam team={team1} team_number={1} match_status={match.status} />
            <MiniTeam team={team2} team_number={2} match_status={match.status} />
        </Paper>
    );
};

export default MatchSummary;
