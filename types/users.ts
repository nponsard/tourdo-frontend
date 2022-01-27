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
    return Fetcher<{ users: User[]; total: number }>(`/api/v1/users?search=${username}`);
};
