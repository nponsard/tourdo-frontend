import { mutate } from "swr";
import { useApi, FetchApi } from "./api";
import { TokenPair, TokenPairSetter } from "./auth";
import { Tournament } from "./tournaments";
import { User } from "./users";

export enum TeamRole {
    PLAYER = 0,
    LEADER = 1,
    COACH = 2,
}
export const TeamRoleNames = ["Player", "Captain", "Coach"];

export interface Team {
    id: number;
    name: string;
    description: string;
    match_count: number;
    win_count: number;
}
export interface TeamMember {
    user: User;
    team_id: number;
    role: TeamRole;
}

export function useGetTeam(team_id: string) {
    return useApi<Team>(`/teams/${team_id}`);
}

export function useGetTeamMembers(team_id: string) {
    return useApi<TeamMember[]>(`/teams/${team_id}/users`);
}

export function useGetTeamTournaments(team_id: string) {
    return useApi<Tournament[]>(`/teams/${team_id}/tournaments`);
}

export function useSearchTeams(query: string, offset = 0, limit = 20) {
    return useApi<{ teams: Team[]; total: number }>(`/teams?search=${query}&offset=${offset}&limit=${limit}`);
}

export function FetchDeleteTeam(team_id: number, tokenPair: TokenPair, setTokenPair: TokenPairSetter) {
    return FetchApi(
        `/teams/${team_id}`,
        {
            method: "DELETE",
        },
        tokenPair,
        setTokenPair
    );
}

export function FetchCreateTeam(
    name: string,
    description: string,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) {
    return FetchApi<Team>(
        `/teams`,
        {
            method: "POST",
            body: JSON.stringify({
                name,
                description,
            }),
        },
        tokenPair,
        setTokenPair
    );
}

export async function FetchEditTeam(
    team_id: number,
    name: string,
    description: string,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) {
    const value_1 = await FetchApi<Team>(
        `/teams/${team_id}`,
        {
            method: "PATCH",
            body: JSON.stringify({
                name,
                description,
            }),
        },
        tokenPair,
        setTokenPair
    );
    mutate(`/teams/${team_id}`, value_1, false);
    return value_1;
}

export function FetchAddTeamMember(
    team_id: number,
    user_id: number,
    role: TeamRole,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) {
    return FetchApi(
        `/teams/${team_id}/users/${user_id}`,
        {
            method: "PUT",
            body: JSON.stringify({
                role,
            }),
        },
        tokenPair,
        setTokenPair
    );
}

export function FetchRemoveTeamMember(
    team_id: number,
    user_id: number,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) {
    return FetchApi(
        `/teams/${team_id}/users/${user_id}`,
        {
            method: "DELETE",
        },
        tokenPair,
        setTokenPair
    );
}
