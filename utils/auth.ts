import { createContext, useState } from "react";
import { BaseFetch, FetchApi } from "./api";
import { User } from "./users";

export interface TokenPair {
    access_token: string;
    refresh_token: string;
}
export type TokenPairSetter = (newTokenPair: TokenPair) => void;

export const LoginContext = createContext({
    user: undefined as User | undefined | null,
    setUser: (newUser: User | undefined | null) => {},

    tokenPair: undefined as TokenPair | undefined | null,
    setTokenPair: (newTokenPair: TokenPair | undefined | null) => {},
});

export async function FetchRefreshToken(refreshToken: string) {
    return BaseFetch<TokenPair>("/tokens/refresh", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
    });
}

export async function FetchLogin(username: string, password: string): Promise<TokenPair> {
    return FetchApi<TokenPair>("/users/login", {
        body: JSON.stringify({ username, password }),
        method: "POST",
    });
}

export async function FetchLogout(tokenPair: TokenPair, setTokenPair: (newTokenPair: TokenPair) => any): Promise<void> {
    return FetchApi<void>(
        "/users/logout",
        {
            method: "POST",
        },
        tokenPair,
        setTokenPair
    );
}

export function CheckLocalStorage() {
    const access_token = localStorage.getItem("accessToken");
    const refresh_token = localStorage.getItem("refreshToken");
    if (access_token && refresh_token) {
        return { access_token, refresh_token };
    }
    return null;
}

export function SaveLocalStorage(tokenPair: TokenPair) {
    localStorage.setItem("accessToken", tokenPair.access_token);
    localStorage.setItem("refreshToken", tokenPair.refresh_token);
}

export function ClearLocalStorage() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}
