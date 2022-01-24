import { Team } from "../types/teams";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardHeader, Chip, Paper } from "@mui/material";
import { typography } from "@mui/system";
import { User } from "../types/users";

const UserSummary = ({ user }: { user: User }) => {
    return (
        <Paper elevation={3} sx={{ width: "20em", p: "0.5rem" }}>
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
                    {user.username}
                </Typography>
                <Box sx={{ flexGrow: 1, minWidth: "1em" }} />
                <Typography sx={{ minWidth: "3em" }}>
                    {user.admin && (
                        <Chip
                            label="admin"
                            color="secondary"
                            variant="outlined"
                        />
                    )}
                </Typography>
            </Box>
        </Paper>
    );
};

export default UserSummary;
