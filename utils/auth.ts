import { createContext, useContext, useState } from "react";
import useSWR from "swr";
import { BASE_URL } from "./api";
import { User } from "./users";

export interface TokenPair {
    access_token: string;
    refresh_token: string;
}

export type TokenPairSetter = (newTokenPair: TokenPair) => void;

export function useUser() {
    const [user, setUser] = useState<User | null>(null);

    return {
        user,
        setUser,
    };
}

export const LoginContext = createContext({
    user: undefined as User | undefined | null,
    setUser: (newUser: User | undefined | null) => {},

    tokenPair: undefined as TokenPair | undefined | null,
    setTokenPair: (newTokenPair: TokenPair | undefined | null) => {},

    setValidToken: (valid: boolean) => {},
    validToken: false,
});

export const refreshToken = async (refresh_token: string) => {
    return BaseFetch("/tokens/refresh", {
        method: "POST",
        body: JSON.stringify({ refresh_token }),
    });
};

export const BaseFetch = async <T>(
    endpoint: string,
    init?: RequestInit | undefined,
    tokenPair?: TokenPair | null
) => {
    const res = await fetch(BASE_URL + endpoint, {
        headers: {
            Authorization: tokenPair?.access_token ?? "",
            ...init?.headers,
        },
        ...init,
    });

    const body = await res.json();
    if (res.status >= 400) {
        throw { message: body.message, status: res.status };
    }
    return body;
};

export interface ApiError {
    message: string;
    status: number;
}

export const CallApi = async <T>(
    endpoint: string,
    init?: RequestInit | undefined,
    tokenPair?: TokenPair | null,
    setTokenPair?: (newTokenPair: TokenPair) => any
) => {
    return BaseFetch<T>(endpoint, init, tokenPair).catch(async (e) => {
        if (e.status != 401 || tokenPair == undefined) throw e;

        const newTokens = await refreshToken(tokenPair.refresh_token);

        if (setTokenPair) setTokenPair(newTokens as TokenPair);
        return BaseFetch<T>(endpoint, init, newTokens);
    });
};

export const UseApi = <T>(endpoint: string, init?: RequestInit | undefined) => {
    const loginCtx = useContext(LoginContext);

    const fetcher = () => {
        return CallApi<T>(
            endpoint,
            init,
            loginCtx.tokenPair,
            loginCtx.setTokenPair
        );
        //     .then((value) => setData(value))
        //     .catch((e) => setError(e));
    };
    return useSWR<T>(endpoint, fetcher);
};

export const CallLogin = async (
    username: string,
    password: string
): Promise<TokenPair> => {
    return CallApi<TokenPair>("/users/login", {
        body: JSON.stringify({ username, password }),
        method: "POST",
    });
};

export const CallLogout = async (
    tokenPair: TokenPair,
    setTokenPair: (newTokenPair: TokenPair) => any
): Promise<void> => {
    return CallApi<void>(
        "/users/logout",
        {
            method: "POST",
        },
        tokenPair,
        setTokenPair
    );
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
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            valid: true,
        });

        return {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
        };
    });
};*/

/*
export const CheckAuth = async (access_token: string, refresh_token: string) => {
    try {
        const user = await GetCurrentUser(access_token);
        return { user, access_token, refresh_token };
    } catch (e) {
        console.log(e);

        const newTokens = await RefreshToken(refresh_token);

        const user = await GetCurrentUser(newTokens.access_token);

        return {
            user,
            access_token: newTokens.access_token,
            refresh_token: newTokens.refresh_token,
        };
    }
};*/

export const CheckLocalStorage = () => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    if (access_token && refresh_token) {
        return { access_token, refresh_token };
    }
    return null;
};

export const SaveLocalStorage = (tokenPair: TokenPair) => {
    localStorage.setItem("access_token", tokenPair.access_token);
    localStorage.setItem("refresh_token", tokenPair.refresh_token);
};

export const ClearLocalStorage = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};
