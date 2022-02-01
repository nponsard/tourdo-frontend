import { FetchApi, useApi } from "./api";
import { TokenPair, TokenPairSetter } from "./auth";
import { Match } from "./matches";
import { Team } from "./teams";
import { User } from "./users";

export enum TournamentType {
    None = 0,
    RoundRobin = 1,
    SimpleElimination = 2,
}
export const TournamentTypeName = ["None", "Round Robin", "Simple Elimination"];

export enum TournamentStatus {
    Created = 0,
    Generated = 1,
    Started = 2,
    Finished = 3,
}

export interface Tournament {
    id: number;
    type: TournamentType;
    name: string;
    description: string;
    start_date: string | null;
    end_date: string | null;
    max_teams: number;
    game_name: string;
    status: TournamentStatus;
}
export interface TournamentTeam {
    team: Team;
    team_number: number;
}

export function useGetTournament(id: string) {
    return useApi<Tournament>(`/tournaments/${id}`);
}
export function useGetTournamentMatches(id: string) {
    return useApi<Match[]>(`/tournaments/${id}/matches`);
}
export function useGetTournamentTeams(id: string) {
    return useApi<{ team: Team; team_number: number }[]>(`/tournaments/${id}/teams`);
}

export function useGetTournamentOrganizers(id: string) {
    return useApi<User[]>(`/tournaments/${id}/organizers`);
}

export function FetchAddTournamentOrganizer(
    tournament_id: number,
    user_id: number,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) {
    return FetchApi(
        `/tournaments/${tournament_id}/organizers/${user_id}`,
        {
            method: "PUT",
        },
        tokenPair,
        setTokenPair
    );
}
export function FetchRemoveTournamentOrganizer(
    tournament_id: number,
    user_id: number,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) {
    return FetchApi(
        `/tournaments/${tournament_id}/organizers/${user_id}`,
        {
            method: "DELETE",
        },
        tokenPair,
        setTokenPair
    );
}

export function useSearchTournaments(query: string, offset = 0, limit = 20) {
    return useApi<{ tournaments: Tournament[]; total: number }>(
        `/tournaments?search=${query}&offset=${offset}&limit=${limit}`
    );
}

export function FetchDeleteTournament(tournament_id: number, tokenPair: TokenPair, setTokenPair: TokenPairSetter) {
    return FetchApi(
        `/tournaments/${tournament_id}`,
        {
            method: "DELETE",
        },
        tokenPair,
        setTokenPair
    );
}

export function FetchCreateTournament(
    name: string,
    description: string,
    start_date: Date | null,
    end_date: Date | null,
    max_teams: number,
    game_name: string,
    type: TournamentType,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) {
    return FetchApi<Tournament>(
        "/tournaments",
        {
            method: "POST",
            body: JSON.stringify({
                name,
                description,
                start_date: start_date ? start_date.toISOString() : null,
                end_date: end_date ? end_date.toISOString() : null,
                max_teams,
                game_name,
                type,
            }),
        },
        tokenPair,
        setTokenPair
    );
}

export function FetchEditTournament(tournament: Tournament, tokenPair: TokenPair, setTokenPair: TokenPairSetter) {
    return FetchApi<Tournament>(
        `/tournaments/${tournament.id}`,
        {
            method: "PATCH",
            body: JSON.stringify(tournament),
        },
        tokenPair,
        setTokenPair
    );
}

export function FetchAddTournamentTeam(
    tournament_id: number,
    team_id: number,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) {
    return FetchApi(
        `/tournaments/${tournament_id}/teams/${team_id}`,
        {
            method: "PUT",
        },
        tokenPair,
        setTokenPair
    );
}

export function FetchShuffleTournamentTeams(
    tournament_id: number,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) {
    return FetchApi(
        `/tournaments/${tournament_id}/teams/shuffle`,
        {
            method: "POST",
        },
        tokenPair,
        setTokenPair
    );
}

export function FetchAddMatch(tournament_id: number, tokenPair: TokenPair, setTokenPair: TokenPairSetter) {
    return FetchApi(
        `/matches`,
        {
            method: "POST",

            body: JSON.stringify({
                team1: null,
                team2: null,
                date: new Date(),
                tournament_id,
                row: 0,
                column: 0,
            }),
        },
        tokenPair,
        setTokenPair
    );
}

export function FetchGenerateMatches(tournament_id: number, tokenPair: TokenPair, setTokenPair: TokenPairSetter) {
    return FetchApi(
        `/tournaments/${tournament_id}/matches/generate`,
        {
            method: "POST",
        },
        tokenPair,
        setTokenPair
    );
}

export function FetchUpdateMatch(match: Match, tokenPair: TokenPair, setTokenPair: TokenPairSetter) {
    return FetchApi(
        `/matches/${match.id}`,
        {
            method: "PATCH",
            body: JSON.stringify(match),
        },
        tokenPair,
        setTokenPair
    );
}

export function FetchDeleteMatch(match_id: number, tokenPair: TokenPair, setTokenPair: TokenPairSetter) {
    return FetchApi(
        `/matches/${match_id}`,
        {
            method: "DELETE",
        },
        tokenPair,
        setTokenPair
    );
}
