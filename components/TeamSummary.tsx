import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { Team } from "../utils/teams";

const TeamSummary = ({ team }: { team: Team }) => {
    return (
        <Link href={`/teams/${team.id}`} passHref>
            <Paper
                elevation={3}
                sx={{
                    cursor: "pointer",
                    width: "23rem",
                    p: "0.5rem",
                    m: "1rem",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            overflowX: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "clip",
                        }}
                    >
                        {team.name}
                    </Typography>
                    <Box sx={{ flexGrow: 1, minWidth: "1em" }} />
                    <Typography sx={{ minWidth: "3em" }}>
                        {team.win_count}W {team.match_count - team.win_count}L
                    </Typography>
                </Box>
                <Typography
                    color="text.secondary"
                    sx={{
                        textOverflow: "ellipsis",
                        overflowX: "hidden",
                        whiteSpace: "nowrap",
                    }}
                >
                    {team.description.length > 0 ? team.description : "No description"}
                </Typography>
            </Paper>
        </Link>
    );
};

export default TeamSummary;
