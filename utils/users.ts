import { BaseFetch, FetchApi, useApi } from "./api";
import { TokenPair, TokenPairSetter } from "./auth";
import { Team } from "./teams";

export interface User {
    id: number;
    username: string;
    admin: boolean;
}

export function useSearchUser(username: string) {
    return useApi<{ users: User[]; total: number }>(`/users?search=${username}`);
}

export function FetchSearchUser(username: string) {
    return BaseFetch<{ users: User[]; total: number }>(`/users?search=${username}`);
}

export function RegisterUser(username: string, password: string) {
    return BaseFetch<{ user: User }>(`/users/register`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });
}

export function FetchLogin(username: string, password: string) {
    return BaseFetch<TokenPair>(`/users/login`, {
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

export const FetchDeleteUser = (userID: number, tokenPair: TokenPair, setTokenPair: TokenPairSetter) => {
    return FetchApi(
        `/users/${userID}`,
        {
            method: "DELETE",
        },
        tokenPair,
        setTokenPair
    );
};

export const FetchChangeUserPassword = (
    oldPassword: string,
    newPassword: string,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) => {
    return FetchApi(
        `/users/me`,
        {
            method: "PATCH",
            body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
        },
        tokenPair,
        setTokenPair
    );
};

export const UpdateUser = (
    userID: number,
    body: { admin?: boolean; password?: string },
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) => {
    return FetchApi(
        `/users/${userID}`,
        {
            method: "PATCH",
            body: JSON.stringify(body),
        },
        tokenPair,
        setTokenPair
    );
};
