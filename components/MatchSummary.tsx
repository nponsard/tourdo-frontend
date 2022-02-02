import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Match } from "../utils/matches";
import { Team } from "../utils/teams";
import EmojiEventsTwoToneIcon from "@mui/icons-material/EmojiEventsTwoTone";

const MiniTeam = ({
    team,
    teamNumber,
    matchStatus,
}: {
    team: Team | undefined;
    teamNumber: number;
    matchStatus: number;
}) => {
    return (
        <Box sx={{ display: "flex" }}>
            <Box sx={{ width: "1.7em", height: "1.5em" }}>
                {matchStatus >= 1 && matchStatus <= 2 && matchStatus === teamNumber && (
                    <EmojiEventsTwoToneIcon color="success" />
                )}
            </Box>
            <Typography
                component="div"
                sx={{
                    overflowX: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "clip",
                    fontStyle: team ? "normal" : "italic",
                }}
                color={teamNumber === matchStatus ? "text.primary" : "text.secondary"}
            >
                {team ? team.name : "TBD"}
            </Typography>
        </Box>
    );
};

const MatchSummary = ({ match, teams }: { match: Match; teams: Team[] }) => {
    let team1 = teams.find((t) => t.id === match.team1_id);
    let team2 = teams.find((t) => t.id === match.team2_id);

    return (
        <Paper elevation={3} sx={{ width: "15em", p: "0.5rem", m: "1rem" }}>
            <MiniTeam team={team1} teamNumber={1} matchStatus={match.status} />
            <MiniTeam team={team2} teamNumber={2} matchStatus={match.status} />
        </Paper>
    );
};

export default MatchSummary;
