import { appendFile } from "fs";
import useSWR from "swr";
import {
    BaseFetch,
    CallApi,
    TokenPair,
    TokenPairSetter,
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
    return BaseFetch<{ user: User }>(`/users/register`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });
};

export const Login = (username: string, password: string) => {
    return BaseFetch<{ access_token: string; refresh_token: string }>(
        `/users/login`,
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

export const useSearchUsers = (query: string, offset = 0, limit = 20) => {
    return UseApi<{ users: User[]; total: number }>(
        `/users?search=${query}&offset=${offset}&limit=${limit}`
    );
};

export const DeleteUser = (
    user_id: number,
    tokenPair: TokenPair,
    setTokenPair: TokenPairSetter
) => {
    return CallApi(
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
    return CallApi(
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
    return CallApi(
        `/users/${user_id}`,
        {
            method: "PATCH",
            body: JSON.stringify(body),
        },
        tokenPair,
        setTokenPair
    );
};
