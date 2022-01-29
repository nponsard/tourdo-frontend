import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import UserSummary from "../../../components/UserSummary";
import { LoginContext } from "../../../utils/auth";
import {
    Role,
    TeamMember,
    useGetTeam,
    useGetTeamMembers,
} from "../../../utils/teams";

const TeamEditor = () => {
    const router = useRouter();
    const { id } = router.query;
    const [currentTab, setTab] = useState(0);
    const context = useContext(LoginContext);

    const { data: team } = useGetTeam(`${id}`);
    const { data: members } = useGetTeamMembers(`${id}`);
    // const { data: tournaments } = useGetTeamTournaments(`${id}`);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    if (!team || !members) return <div>Loading</div>;

    const captains = members.filter(
        (member: TeamMember) => member.role == Role.LEADER
    );
    const coaches = members.filter(
        (member: TeamMember) => member.role == Role.COACH
    );
    const players = members.filter(
        (member: TeamMember) => member.role == Role.PLAYER
    );

    const canEdit =
        captains.some((captain: TeamMember) => {
            captain.user.id == context.user?.id;
        }) || context.user?.admin;

    console.log("context :", context);

    console.log(canEdit);

    if (members && context.user !== undefined && !canEdit) router.push("/");

    return (
        <Box sx={{ p: "1rem" }}>
            <Typography variant="body1" color="text.secondary">
                Team
            </Typography>
            <Box
                sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
            >
                <Typography variant="h4">{team.name}</Typography>
                <Box sx={{ flexGrow: 1 }} />
            </Box>
            <Typography variant="body1">{team.description}</Typography>

            {captains.length > 0 && (
                <>
                    <Typography
                        variant="h5"
                        sx={{ textAlign: "center", marginTop: "1rem" }}
                    >
                        Captain{captains.length > 1 ? "s" : ""}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                        }}
                    >
                        {captains.map((captain: TeamMember) => (
                            <UserSummary
                                key={captain.user.id}
                                user={captain.user}
                            />
                        ))}
                    </Box>
                </>
            )}
            {coaches.length > 0 && (
                <>
                    <Typography
                        variant="h5"
                        sx={{ textAlign: "center", marginTop: "1rem" }}
                    >
                        Coach{captains.length > 1 ? "es" : ""}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                        }}
                    >
                        {coaches.map((member: TeamMember) => (
                            <UserSummary
                                key={member.user.id}
                                user={member.user}
                            />
                        ))}
                    </Box>
                </>
            )}

            {players.length > 0 && (
                <>
                    <Typography
                        variant="h5"
                        sx={{ textAlign: "center", marginTop: "1rem" }}
                    >
                        Player{captains.length > 1 ? "s" : ""}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                        }}
                    >
                        {players.map((member: TeamMember) => (
                            <UserSummary
                                key={member.user.id}
                                user={member.user}
                            />
                        ))}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default TeamEditor;
