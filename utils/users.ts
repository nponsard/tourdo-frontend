import useSWR from "swr";

import { Fetcher } from "./fetcher";
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
    return Fetcher<{ user: User }>(`/api/v1/users/register`, {
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
