import {
    Badge,
    Box,
    Button,
    Chip,
    Divider,
    Paper,
    Skeleton,
    Typography,
} from "@mui/material";
import { FetchEvent } from "next/dist/server/web/spec-compliant/fetch-event";
import { useRouter } from "next/router";
import {
    AddTournamentOrganizer,
    FetchTournament,
    FetchTournamentMatches,
    FetchTournamentOrganizers,
    FetchTournamentTeams,
    RemoveTournamentOrganizer,
} from "../../../utils/tournaments";
import useSWR from "swr";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useContext, useState } from "react";
import TournamentRepresentation from "../../../components/TournamentRepresentation";
import TeamSummary from "../../../components/TeamSummary";
import MatchSummary from "../../../components/MatchSummary";
import UserSummary from "../../../components/UserSummary";
import OrganizerManager from "../../../components/OrganizerManager";
import { useGetTeamsOfUser, useGetUser, User } from "../../../utils/users";
import { LoginContext } from "../../../utils/auth";
import {
    DeleteTeam,
    Role,
    Team,
    TeamMember,
    useGetTeam,
    useGetTeamMembers,
    useGetTeamTournaments,
} from "../../../utils/teams";
import Link from "next/link";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

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

    console.log("context :" , context);

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
