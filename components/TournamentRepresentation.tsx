import { Match } from "../utils/matches";
import { Team } from "../utils/teams";
import { Tournament, TournamentType } from "../utils/tournaments";

export function DefaultTournament(props: {
    tournament: Tournament;
    matches: Match[];
    teams: Team[];
}) {
    return <></>;
}
export function SimpleElimination(props: {
    tournament: Tournament;
    matches: Match[];
    teams: Team[];
}) {
    return <></>;
}

export default function TournamentRepresentation(props: {
    tournament: Tournament;
    matches: Match[];
    teams: Team[];
}) {
    switch (props.tournament.type) {
        case TournamentType.SimpleElimination:
            return (
                <SimpleElimination
                    tournament={props.tournament}
                    teams={props.teams}
                    matches={props.matches}
                />
            );
        default:
            return (
                <DefaultTournament
                    tournament={props.tournament}
                    teams={props.teams}
                    matches={props.matches}
                />
            );
    }
}
