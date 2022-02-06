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
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    max_teams: number;
    game_name: string | null;
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
    tournamentID: number,
    userID: number,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) {
    return FetchApi(
        `/tournaments/${tournamentID}/organizers/${userID}`,
        {
            method: "PUT",
        },
        tokenPair,
        setTokenPair
    );
}
export function FetchRemoveTournamentOrganizer(
    tournamentID: number,
    userID: number,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) {
    return FetchApi(
        `/tournaments/${tournamentID}/organizers/${userID}`,
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

export function FetchDeleteTournament(tounamentID: number, tokenPair: TokenPair, setTokenPair: TokenPairSetter) {
    return FetchApi(
        `/tournaments/${tounamentID}`,
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
    startDate: Date | null,
    endDate: Date | null,
    maxTeams: number,
    gameName: string,
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
                start_date: startDate ? startDate.toISOString() : null,
                end_date: endDate ? endDate.toISOString() : null,
                max_teams: maxTeams,
                game_name: gameName,
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
    tournamentID: number,
    teamID: number,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) {
    return FetchApi(
        `/tournaments/${tournamentID}/teams/${teamID}`,
        {
            method: "PUT",
        },
        tokenPair,
        setTokenPair
    );
}

export function FetchShuffleTournamentTeams(tournamentID: number, tokenPair: TokenPair, setTokenPair: TokenPairSetter) {
    return FetchApi(
        `/tournaments/${tournamentID}/teams/shuffle`,
        {
            method: "POST",
        },
        tokenPair,
        setTokenPair
    );
}

export function FetchAddMatch(tournamentID: number, tokenPair: TokenPair, setTokenPair: TokenPairSetter) {
    return FetchApi(
        `/matches`,
        {
            method: "POST",

            body: JSON.stringify({
                team1: null,
                team2: null,
                date: new Date(),
                tournament_id: tournamentID,
                row: 0,
                column: 0,
            }),
        },
        tokenPair,
        setTokenPair
    );
}

export function FetchGenerateMatches(tournamentID: number, tokenPair: TokenPair, setTokenPair: TokenPairSetter) {
    return FetchApi(
        `/tournaments/${tournamentID}/matches/generate`,
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

export function FetchDeleteMatch(tournamentID: number, tokenPair: TokenPair, setTokenPair: TokenPairSetter) {
    return FetchApi(
        `/matches/${tournamentID}`,
        {
            method: "DELETE",
        },
        tokenPair,
        setTokenPair
    );
}
