import useSWR from "swr";
import { CallApi, TokenPair, TokenPairSetter, UseApi } from "./auth";
import { Fetcher } from "./fetcher";
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

export const useGetTournament = (id: string) => {
    return useSWR<Tournament>(`/api/v1/tournaments/${id}`, Fetcher);
};
export const useGetTournamentMatches = (id: string) => {
    return useSWR<Match[]>(`/api/v1/tournaments/${id}/matches`, Fetcher);
};
export const useGetTournamentTeams = (id: string) => {
    return useSWR<{ team: Team; team_number: number }[]>(
        `/api/v1/tournaments/${id}/teams`,
        Fetcher
    );
};

export const useGetTournamentOrganizers = (id: string) => {
    return useSWR<User[]>(`/api/v1/tournaments/${id}/organizers`, Fetcher);
};

export const AddTournamentOrganizer = (
    tournament_id: number,
    user_id: number,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) => {
    return CallApi(
        `/tournaments/${tournament_id}/organizers/${user_id}`,
        {
            method: "PUT",
        },
        tokenPair,
        setTokenPair
    );
};
export const RemoveTournamentOrganizer = (
    tournament_id: number,
    user_id: number,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) => {
    return CallApi(
        `/tournaments/${tournament_id}/organizers/${user_id}`,
        {
            method: "DELETE",
        },
        tokenPair,
        setTokenPair
    );
};

export const useSearchTournaments = (query: string, offset = 0, limit = 20) => {
    return UseApi<{ tournaments: Tournament[]; total: number }>(
        `/tournaments?search=${query}&offset=${offset}&limit=${limit}`
    );
};

export const DeleteTournament = (
    tournament_id: number,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) => {
    return CallApi(
        `/tournaments/${tournament_id}`,
        {
            method: "DELETE",
        },
        tokenPair,
        setTokenPair
    );
};

export const CreateTournament = (
    name: string,
    description: string,
    start_date: Date | null,
    end_date: Date | null,
    max_teams: number,
    game_name: string,
    type: TournamentType,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) => {
    return CallApi<Tournament>(
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
};

export const EditTournament = (
    tournament: Tournament,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) => {
    return CallApi<Tournament>(
        `/tournaments/${tournament.id}`,
        {
            method: "PATCH",
            body: JSON.stringify(tournament),
        },
        tokenPair,
        setTokenPair
    );
};

export const AddTournamentTeam = (
    tournament_id: number,
    team_id: number,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) => {
    return CallApi(
        `/tournaments/${tournament_id}/teams/${team_id}`,
        {
            method: "PUT",
        },
        tokenPair,
        setTokenPair
    );
};
