import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
    Box,
    Button,
    Chip, Typography
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import TeamSummary from "../../../components/TeamSummary";
import { LoginContext } from "../../../utils/auth";
import { Team } from "../../../utils/teams";
import {
    FetchDeleteUser,
    useGetTeamsOfUser,
    useGetUser
} from "../../../utils/users";
const boxSx = {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
};

const UserDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const context = useContext(LoginContext);

    const { data: user } = useGetUser(`${id}`);

    const { data: teams } = useGetTeamsOfUser(`${id}`);

    if (!user) return <div>Loading</div>;

    const canEdit = context.user?.admin || context.user?.id === user.id;

    return (
        <Box sx={{ p: "1rem" }}>
            <Typography variant="body1" color="text.secondary">
                User
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap-reverse",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4">
                    {user.username}{" "}
                    {user.admin && (
                        <Chip
                            color="secondary"
                            label="Admin"
                            variant="outlined"
                        />
                    )}
                </Typography>

                <Box sx={{ flexGrow: 1 }} />
                <Box>
                    {canEdit && (
                        <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            color="error"
                            onClick={() => {
                                if (context.tokenPair && context.setTokenPair)
                                    FetchDeleteUser(
                                        user.id,
                                        context.tokenPair,
                                        context.setTokenPair
                                    )
                                        .then(() => {
                                            if (user.id == context.user?.id)
                                                context.setTokenPair(null);

                                            router.push("/");
                                        })
                                        .catch(console.error);
                            }}
                        >
                            Delete
                        </Button>
                    )}
                    {context.user?.admin && (
                        <Link href={`/users/${user.id}/edit`} passHref>
                            <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                color="primary"
                                sx={{ marginLeft: "1rem" }}
                            >
                                Edit
                            </Button>
                        </Link>
                    )}
                </Box>
            </Box>
            <Typography variant="h5" sx={{ marginTop: "1rem" }}>
                Teams
            </Typography>

            {teams && (
                <Box sx={boxSx}>
                    {teams.map((team: Team) => (
                        <TeamSummary key={team.id} team={team} />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default UserDetail;
