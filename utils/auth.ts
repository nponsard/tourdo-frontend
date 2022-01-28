import { createContext, useContext, useState } from "react";
import useSWR from "swr";
import { BASE_URL } from "./api";
import { User } from "./users";

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null);

    return {
        user,
        setUser,
    };
}

export const LoginContext = createContext({
    user: undefined as User | undefined,
    setUser: (newUser: User) => {},

    tokenPair: undefined as TokenPair | undefined,
    setTokenPair: (newTokenPair: TokenPair) => {},

    setValidToken: (valid: boolean) => {},
    validToken: false,
});

export const refreshToken = async (refreshToken: string) => {
    return BaseFetch("tokens/refresh", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
    });
};

export const BaseFetch = async <T>(
    endpoint: string,
    init?: RequestInit | undefined,
    tokenPair?: TokenPair
) => {
    const res = await fetch(BASE_URL + endpoint, {
        headers: {
            Authorization: tokenPair?.accessToken ?? "",
            ...init?.headers,
        },
    });
    const body = await res.json();
    if (res.status >= 400) {
        throw { message: body.message, status: res.status };
    }
    return await body;
};

export const UseApi = <T>(endpoint: string, init?: RequestInit | undefined) => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<any>(null);

    const loginCtx = useContext(LoginContext);

    BaseFetch<T>(endpoint, init, loginCtx.tokenPair)
        .then((data) => {
            setData(data);
        })
        .catch(async (e) => {
            try {
                if (e.status != 401 || loginCtx.tokenPair == undefined) throw e;

                const newTokens = await refreshToken(
                    loginCtx.tokenPair.refreshToken
                );

                await BaseFetch<T>(endpoint, init, newTokens).then((data) => {
                    setData(data);
                });
                loginCtx.setTokenPair(newTokens);
            } catch (e) {
                setError(e);
            }
        });

    return { data, error };
};

/*

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
};*/

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
    return undefined;
};

export const SaveLocalStorage = (tokenPair: TokenPair) => {
    localStorage.setItem("accessToken", tokenPair.accessToken);
    localStorage.setItem("refreshToken", tokenPair.refreshToken);
};
