import { Paper, Table, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { useCallback } from "react";
import { Match, MatchStatus } from "../utils/matches";
import { Team } from "../utils/teams";
import { Tournament, TournamentType } from "../utils/tournaments";
import MatchSummary from "./MatchSummary";

const boxSx = {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
};

export function DefaultTournament(props: { tournament: Tournament; matches: Match[]; teams: Team[] }) {
    const getTeamWins = useCallback(
        (team: Team) => {
            return props.matches.filter(
                (match) =>
                    (match.team1_id === team.id && match.status === MatchStatus.Team1Won) ||
                    (match.team2_id === team.id && match.status === MatchStatus.Team2Won)
            ).length;
        },
        [props.matches]
    );

    const teamsWithWins = props.teams.map((team) => {
        return {
            ...team,
            wins: getTeamWins(team),
        };
    });

    return (
        <>
            <Typography variant="h5">Leaderboard</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: "20rem" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Position</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Wins</TableCell>
                        </TableRow>
                    </TableHead>
                    {teamsWithWins
                        .sort((a, b) => {
                            return b.wins - a.wins;
                        })
                        .map((team, index) => (
                            <Link key={team.id} href={`/teams/${team.id}`} passHref>
                                <TableRow>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{team.name}</TableCell>
                                    <TableCell>{team.wins}</TableCell>
                                </TableRow>
                            </Link>
                        ))}
                </Table>
            </TableContainer>
        </>
    );
}
export function SimpleElimination(props: { tournament: Tournament; matches: Match[]; teams: Team[] }) {
    let maxRow = 0;
    let maxColumn = 0;

    for (const match of props.matches) {
        if (match.row > maxRow) maxRow = match.row;
        if (match.column > maxColumn) maxColumn = match.column;
    }

    if (props.matches.length === 0) return <Typography variant="h5">Tournament not yet generated</Typography>;

    return (
        <Box
            sx={{
                display: "grid",
                overflowX: "auto",
                gridTemplateColumns: `repeat(${maxColumn}, 1fr)`,
                gridTemplateRows: `repeat(${maxRow},1fr)`,
            }}
        >
            {props.matches.map((match) => (
                <Box
                    key={match.id}
                    sx={{
                        gridColumn: `${match.column + 1}`,
                        gridRow: `${match.row * 2 ** match.column + 1} / span ${2 ** match.column} `,
                        margin: "auto",
                    }}
                >
                    <MatchSummary match={match} teams={props.teams} />
                </Box>
            ))}
        </Box>
    );
}

export default function TournamentRepresentation(props: { tournament: Tournament; matches: Match[]; teams: Team[] }) {
    switch (props.tournament.type) {
        case TournamentType.SimpleElimination:
            return <SimpleElimination tournament={props.tournament} teams={props.teams} matches={props.matches} />;
        default:
            return <DefaultTournament tournament={props.tournament} teams={props.teams} matches={props.matches} />;
    }
}
