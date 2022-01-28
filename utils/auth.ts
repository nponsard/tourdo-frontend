import { createContext, useContext, useState } from "react";
import useSWR from "swr";
import { BASE_URL } from "./api";
import { Fetcher, LoggedInFetcher } from "./fetcher";
import { User } from "./users";

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export interface TokenManager {
    tokenPair: TokenPair;
    setTokens: (tokens: TokenPair) => void;
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null);

    return {
        user,
        setUser,
    };
}

export const LoginContext = createContext({
    user: null as User | null,
    tokenManager: {
        tokenPair: { accessToken: "", refreshToken: "", valid: false },
        setTokens: () => {},
    } as TokenManager,
    setUser: (newUser: User) => {},
});

export const GetCurrentUser = async (
    tokens: TokenManager,
    invalidRedirect: () => any
) => {
    return LoggedInFetcher<User>(
        `/api/v1/users/me`,
        tokens,
        invalidRedirect
    ).then((user) => {
        if (!user.username) throw new Error("Invalid user");

        return user;
    });
};

export const useRefreshToken = async (refreshToken: string) => {
    return BaseFetch<TokenPair>("/tokens/refresh", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
    });
};

export const BaseFetch = <T>(
    endpoint: string,
    init?: RequestInit | undefined,
    user?: {
        user: User | null;
        tokenManager: TokenManager;
        setUser: (newUser: User) => void;
    }
) => {
    const fetcher = () => {
        return fetch(BASE_URL + endpoint, {
            headers: {
                Authorization: `${user?.tokenManager.tokenPair.accessToken}`,
                ...init?.headers,
            },
        }).then(async (res) => {
            const body = await res.json();

            if (res.status >= 400) {
                throw { message: body.message, status: res.status };
            }

            return body;
        });
    };

    return useSWR<T>(endpoint, fetcher);
};

export const UseApi = <T>(endpoint: string, init?: RequestInit | undefined) => {
    const user = useContext(LoginContext);

    const result = BaseFetch<T>(endpoint, user, init);

    if (result.error) {
        if (result.error.status === 401) {
            const refreshToken = user.tokenManager.tokenPair.refreshToken;

            const refreshResult = useRefreshToken(refreshToken)
            
        }
    }
};

export const LoginUser = async (
    username: string,
    password: string,
    tokenManager: TokenManager
) => {
    return Fetcher<{ access_token: string; refresh_token: string }>(
        `/api/v1/users/login`,
        {
            method: "POST",
            body: JSON.stringify({ username, password }),
        }
    ).then((data) => {
        if (!data.access_token || !data.refresh_token)
            throw new Error("Invalid tokens received");

        tokenManager.setTokens({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            valid: true,
        });

        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
        };
    });
};

/*
export const CheckAuth = async (accessToken: string, refreshToken: string) => {
    try {
        const user = await GetCurrentUser(accessToken);
        return { user, accessToken, refreshToken };
    } catch (e) {
        console.log(e);

        const newTokens = await RefreshToken(refreshToken);

        const user = await GetCurrentUser(newTokens.accessToken);

        return {
            user,
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
        };
    }
};*/

export const CheckLocalStorage = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken && refreshToken) {
        return { accessToken, refreshToken };
    }
    return null;
};

export const SaveLocalStorage = (tokensManager: TokenManager) => {
    localStorage.setItem("accessToken", tokensManager.tokenPair.accessToken);
    localStorage.setItem("refreshToken", tokensManager.tokenPair.refreshToken);
};
