import { Team } from "../utils/teams";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardHeader, Chip, IconButton, Paper } from "@mui/material";
import { typography } from "@mui/system";
import { User } from "../utils/users";
import DeleteIcon from "@mui/icons-material/Delete";
const UserSummary = ({
    user,
    deleteAction,
}: {
    user: User;
    deleteAction?: (id: number) => any;
}) => {
    return (
        <Paper
            elevation={3}
            sx={{ width: "20em", p: "0.5rem", height: "3rem" }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
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
                {deleteAction && (
                    <IconButton aria-label="Delete" color="error" size="small">
                        <DeleteIcon />
                    </IconButton>
                )}
            </Box>
        </Paper>
    );
};

export default UserSummary;
