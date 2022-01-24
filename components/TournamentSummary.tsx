import { Team } from "../types/teams";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardHeader, Paper } from "@mui/material";
import { typography } from "@mui/system";
import { Tournament } from "../types/tournaments";

const TournamentSummary = ({ tournament }: { tournament: Tournament }) => {
    return (
        <Paper elevation={3} sx={{ width: "20em", p: "0.5rem" }}>
            <Typography
                variant="h6"
                component="div"
                sx={{
                    overflowX: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "clip",
                }}
            >
                {tournament.name}
            </Typography>

            <Typography
                color="text.secondary"
                sx={{
                    textOverflow: "ellipsis",
                    overflowX: "hidden",
                    whiteSpace: "nowrap",
                }}
            >
                {tournament.game_name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2">
                    {tournament.start_date.toLocaleDateString()} -
                    {tournament.end_date.toLocaleDateString()}
                </Typography>
                <Box sx={{ flexGrow: 1, minWidth: "1em" }} />
                <Typography variant="body2">
                    {tournament.max_teams} teams
                </Typography>
            </Box>
        </Paper>
    );
};

export default TournamentSummary;
