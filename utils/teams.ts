import { CallApi, TokenPair, TokenPairSetter, UseApi } from "./auth";
import { Tournament } from "./tournaments";
import { User } from "./users";

export enum Role {
    PLAYER = 0,
    LEADER = 1,
    COACH = 2,
}

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
    role: Role;
}

export const useGetTeam = (team_id: string) => {
    return UseApi<Team>(`/teams/${team_id}`);
};

export const useGetTeamMembers = (team_id: string) => {
    return UseApi<TeamMember[]>(`/teams/${team_id}/users`);
};

export const useGetTeamTournaments = (team_id: string) => {
    return UseApi<Tournament[]>(`/teams/${team_id}/tournaments`);
};

export const useSearchTeams = (query: string, offset = 0, limit = 20) => {
    return UseApi<{ teams: Team[]; total: number }>(
        `/teams?search=${query}&offset=${offset}&limit=${limit}`
    );
};

export const DeleteTeam = (
    team_id: number,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) => {
    return CallApi(
        `/teams/${team_id}`,
        {
            method: "DELETE",
        },
        tokenPair,
        setTokenPair
    );
};

export const CreateTeam = (
    name: string,
    description: string,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) => {
    return CallApi(
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
};
