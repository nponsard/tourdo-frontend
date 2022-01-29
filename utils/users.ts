import { appendFile } from "fs";
import useSWR from "swr";
import {
    BaseFetch,
    CallApi,
    TokenPair,
    UseApi,
    UseApi as useApi,
} from "./auth";

import { Fetcher } from "./fetcher";
import { Team } from "./teams";
export interface User {
    id: number;
    username: string;
    admin: boolean;
}

export const SearchUser = (username: string) => {
    return useSWR<{ users: User[]; total: number }>(
        `/api/v1/users?search=${username}`,
        Fetcher
    );
};

export const SearchUserFetch = (username: string) => {
    return Fetcher<{ users: User[]; total: number }>(
        `/api/v1/users?search=${username}`
    );
};

export const RegisterUser = (username: string, password: string) => {
    return BaseFetch<{ user: User }>(`/api/v1/users/register`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });
};

export const Login = (username: string, password: string) => {
    return Fetcher<{ accessToken: string; refreshToken: string }>(
        `/api/v1/users/login`,
        {
            method: "POST",
            body: JSON.stringify({ username, password }),
        }
    );
};

export const GetCurrentUser = (
    tokenPair?: TokenPair,
    setTokenPair?: (newTokenPair: TokenPair) => any
) => {
    return CallApi(`/users/me`, undefined, tokenPair, setTokenPair);
};

export const useGetUser = (id: string) => {
    return UseApi<User>(`/users/${id}`);
};

export const useGetTeamsOfUser = (id: string) => {
    return UseApi<Team[]>(`/users/${id}/teams`);
};

export const useSearchUsers = (query: string) => {
    return UseApi<{ users: User[]; total: number }>(`/users?search=${query}`);
};
