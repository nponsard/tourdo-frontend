import { createContext, useState } from "react";
import { Fetcher, LoggedInFetcher } from "./fetcher";
import { User } from "./users";

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    valid: boolean;
}
export interface TokenManager {
    tokenPair: TokenPair;
    setTokens: (tokens: TokenPair) => void;
}

export const LoginContext = createContext({
    user: null as User | null,
    tokensManager: null as TokenManager | null,
    setUser: (newUser: User) => {},
});

export const GetCurrentUser = async (tokens: TokenManager) => {
    return LoggedInFetcher<User>(`/api/v1/users/me`, tokens).then((user) => {
        if (!user.username) throw new Error("Invalid user");

        return user;
    });
};

export const RefreshToken = async (refreshToken: string) => {
    return Fetcher<{ accessToken: string; refreshToken: string }>(
        `/api/v1/users/refresh`,
        {
            method: "POST",
            body: JSON.stringify({ refresh_token: refreshToken }),
        }
    ).then((data) => {
        if (!data.accessToken || !data.refreshToken)
            throw new Error("Invalid token");

        return data;
    });
};

export const LoginUser = async (username: string, password: string) => {
    return Fetcher<{ accessToken: string; refreshToken: string }>(
        `/api/v1/users/login`,
        {
            method: "POST",
            body: JSON.stringify({ username, password }),
        }
    ).then((data) => {
        if (!data.accessToken || !data.refreshToken)
            throw new Error("Invalid token");

        return data;
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
