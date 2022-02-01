import useSWR from "swr";
import { BaseFetch, FetchApi, useApi } from "./api";
import { TokenPair, TokenPairSetter } from "./auth";
import { Fetcher } from "./fetcher";
import { Team } from "./teams";

export interface User {
    id: number;
    username: string;
    admin: boolean;
}

export function useSearchUser(username: string) {
    return useSWR<{ users: User[]; total: number }>(`/api/v1/users?search=${username}`, Fetcher);
}

export function SearchUserFetch(username: string) {
    return BaseFetch<{ users: User[]; total: number }>(`/users?search=${username}`);
}

export function RegisterUser(username: string, password: string) {
    return BaseFetch<{ user: User }>(`/users/register`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });
}

export function LoginFetch(username: string, password: string) {
    return BaseFetch<{ access_token: string; refresh_token: string }>(`/users/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });
}

export function FetchCurrentUser(tokenPair?: TokenPair, setTokenPair?: (newTokenPair: TokenPair) => any) {
    return FetchApi<User>(`/users/me`, undefined, tokenPair, setTokenPair);
}

export const useGetUser = (id: string) => {
    return useApi<User>(`/users/${id}`);
};

export const useGetTeamsOfUser = (id: string) => {
    return useApi<Team[]>(`/users/${id}/teams`);
};

export const useSearchUsers = (query: string, offset = 0, limit = 20) => {
    return useApi<{ users: User[]; total: number }>(`/users?search=${query}&offset=${offset}&limit=${limit}`);
};

export const DeleteUser = (user_id: number, tokenPair: TokenPair, setTokenPair: TokenPairSetter) => {
    return FetchApi(
        `/users/${user_id}`,
        {
            method: "DELETE",
        },
        tokenPair,
        setTokenPair
    );
};

export const ChangeUserPassword = (
    old_password: string,
    new_password: string,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) => {
    return FetchApi(
        `/users/me`,
        {
            method: "PATCH",
            body: JSON.stringify({ old_password, new_password }),
        },
        tokenPair,
        setTokenPair
    );
};

export const UpdateUser = (
    user_id: number,
    body: { admin?: boolean; password?: string },
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) => {
    return FetchApi(
        `/users/${user_id}`,
        {
            method: "PATCH",
            body: JSON.stringify(body),
        },
        tokenPair,
        setTokenPair
    );
};
