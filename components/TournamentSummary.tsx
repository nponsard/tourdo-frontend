import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { Tournament } from "../utils/tournaments";

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
                    {tournament.gameName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2">
                        {tournament.startDate && tournament.endDate ? (
                            <>
                                {new Date(tournament.startDate).toLocaleDateString()} -
                                {new Date(tournament.endDate).toLocaleDateString()}
                            </>
                        ) : (
                            <>No date specified</>
                        )}
                    </Typography>
                    <Box sx={{ flexGrow: 1, minWidth: "1em" }} />
                    <Typography variant="body2">{tournament.maxTeams} teams</Typography>
                </Box>
            </Paper>
        </Link>
    );
};

export default TournamentSummary;
