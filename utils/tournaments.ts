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
    start_date: string;
    end_date: string;
    max_teams: number;
    game_name: string;
    status: TournamentStatus;
}
export interface TournamentTeam {
    team: Team;
    team_number: number;
}

export const FetchTournament = (id: string) => {
    return useSWR<Tournament>(`/api/v1/tournaments/${id}`, Fetcher);
};
export const FetchTournamentMatches = (id: string) => {
    return useSWR<Match[]>(`/api/v1/tournaments/${id}/matches`, Fetcher);
};
export const FetchTournamentTeams = (id: string) => {
    return useSWR<{ team: Team; team_number: number }[]>(
        `/api/v1/tournaments/${id}/teams`,
        Fetcher
    );
};

export const FetchTournamentOrganizers = (id: string) => {
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


export const DeleteTournament = (tournament_id: number, tokenPair: TokenPair, setTokenPair: TokenPairSetter) => {
    return CallApi(
        `/tournaments/${tournament_id}`,
        {
            method: "DELETE",
        },
        tokenPair,
        setTokenPair
    );
}
