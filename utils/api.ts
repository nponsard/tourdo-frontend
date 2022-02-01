import { useContext } from "react";
import getConfig from "next/config";
import useSWR from "swr";
import { TokenPair, FetchRefreshToken, LoginContext } from "./auth";

const { publicRuntimeConfig } = getConfig();

const urlFetch = fetch("/api/url")
    .then((res) => res.json() as Promise<{ BACKEND_URL: string | null }>)
    .catch(() => {
        return { BACKEND_URL: null };
    });

const defaultServer =
    publicRuntimeConfig.NODE_ENV === "production" ? "https://woa-backend.juno.nponsard.net" : "http://localhost:8080";
console.log(defaultServer, publicRuntimeConfig);

async function getBaseURL() {
    const res = await urlFetch;

    return (res.BACKEND_URL ?? defaultServer) + "/api/v1";
}

export async function BaseFetch<T>(endpoint: string, init?: RequestInit | undefined, tokenPair?: TokenPair | null) {
    const BASE_URL = await getBaseURL();

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
    return body as T;
}

export interface ApiError {
    message: string;
    status: number;
}

export async function FetchApi<T>(
    endpoint: string,
    init?: RequestInit | undefined,
    tokenPair?: TokenPair | null,
    setTokenPair?: (newTokenPair: TokenPair) => any
) {
    return BaseFetch<T>(endpoint, init, tokenPair).catch(async (e) => {
        if (e.status != 401 || tokenPair == undefined) throw e;

        const newTokens = await FetchRefreshToken(tokenPair.refresh_token);

        if (setTokenPair) setTokenPair(newTokens as TokenPair);
        return BaseFetch<T>(endpoint, init, newTokens);
    });
}

export function useApi<T>(endpoint: string, init?: RequestInit | undefined) {
    const loginCtx = useContext(LoginContext);

    const fetcher = () => {
        return FetchApi<T>(endpoint, init, loginCtx.tokenPair, loginCtx.setTokenPair);
    };
    return useSWR<T>(endpoint, fetcher);
}
