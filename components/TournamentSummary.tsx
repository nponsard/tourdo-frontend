import { Team } from "../utils/teams";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardHeader, Paper } from "@mui/material";
import { typography } from "@mui/system";
import { Tournament } from "../utils/tournaments";
import Link from "next/link";

const TournamentSummary = ({ tournament }: { tournament: Tournament }) => {
    return (
        <Link href={`/tournaments/${tournament.id}`} passHref>
            <Paper
                elevation={3}
                sx={{
                    cursor: "pointer",
                    width: "23rem",
                    p: "0.5rem",
                    m: "1rem",
                }}
            >
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
                        {tournament.start_date ? (
                            <>
                                {new Date(
                                    tournament.start_date
                                ).toLocaleDateString()}{" "}
                                -
                                {new Date(
                                    tournament.end_date
                                ).toLocaleDateString()}
                            </>
                        ) : (
                            <>No date specified</>
                        )}
                    </Typography>
                    <Box sx={{ flexGrow: 1, minWidth: "1em" }} />
                    <Typography variant="body2">
                        {tournament.max_teams} teams
                    </Typography>
                </Box>
            </Paper>
        </Link>
    );
};

export default TournamentSummary;
