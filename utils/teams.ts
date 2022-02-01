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

export function useGetTeam(teamID: string) {
    return useApi<Team>(`/teams/${teamID}`);
}

export function useGetTeamMembers(teamID: string) {
    return useApi<TeamMember[]>(`/teams/${teamID}/users`);
}

export function useGetTeamTournaments(teamID: string) {
    return useApi<Tournament[]>(`/teams/${teamID}/tournaments`);
}

export function useSearchTeams(query: string, offset = 0, limit = 20) {
    return useApi<{ teams: Team[]; total: number }>(`/teams?search=${query}&offset=${offset}&limit=${limit}`);
}

export function FetchDeleteTeam(teamID: number, tokenPair: TokenPair, setTokenPair: TokenPairSetter) {
    return FetchApi(
        `/teams/${teamID}`,
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
    teamID: number,
    name: string,
    description: string,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) {
    const result = await FetchApi<Team>(
        `/teams/${teamID}`,
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
    mutate(`/teams/${teamID}`, result, false);
    return result;
}

export function FetchAddTeamMember(
    teamID: number,
    userID: number,
    role: TeamRole,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) {
    return FetchApi(
        `/teams/${teamID}/users/${userID}`,
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
    teamID: number,
    userID: number,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) {
    return FetchApi(
        `/teams/${teamID}/users/${userID}`,
        {
            method: "DELETE",
        },
        tokenPair,
        setTokenPair
    );
}
