import { Chip, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { User } from "../utils/users";
const UserSummary = ({
    user,
}: {
    user: User;
}) => {
    return (
        <Link href={`/users/${user.id}`} passHref>
            <Paper
                elevation={3}
                sx={{
                    cursor: "pointer",
                    width: "23em",
                    p: "0.5rem",
                    height: "3rem",
                    margin:"1rem"
                }}
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
                    <
                        Box sx={{ minWidth: "3em" }}>
                        {user.admin && (
                            <Chip
                                label="admin"
                                color="secondary"
                                variant="outlined"
                            />
                        )}
                    </Box>
                    
                </Box>
            </Paper>
        </Link>
    );
};

export default UserSummary;
