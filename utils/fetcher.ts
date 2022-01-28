import { useRouter } from "next/router";
import { refreshToken } from "./auth";

export const Fetcher = <T>(
    url: string,
    init?: RequestInit | undefined
): Promise<T> => {
    return fetch(url, init).then((r) => {
        if (r.status >= 400) {
            return r.json().then((e) => {
                throw { message: e.message, status: r.status };
            });
        }

        return r.json();
    });
};
/*
export const LoggedInFetcher = async <T>(
    url: string,
    tokens: TokenManager,
    invalidRedirect: () => void,
    init?: RequestInit | undefined
): Promise<T> => {
    const headers = {
        Authorization: `${tokens.tokenPair.accessToken}`,
    };

    const r = await fetch(url, {
        ...init,
        headers,
    });

    if (r.status == 401) {
        const newTokens = await refreshToken(
            tokens.tokenPair.refreshToken
        ).catch((e) => {
            console.log(e);

            tokens.setTokens({
                accessToken: "",
                refreshToken: "",
                valid: false,
            });

            return null;
        });

        if (!newTokens) {
            invalidRedirect();
            throw new Error("Invalid token");
        }

        const headers = {
            Authorization: `${newTokens.accessToken}`,
        };

        const r = await fetch(url, {
            ...init,
            headers,
        });

        tokens.setTokens({
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
            valid: true,
        });

        return r.json();
    }

    if (r.status >= 400) {
        return r.json().then((e) => {
            throw { message: e.message, status: r.status };
        });
    }
    return await r.json();
};
*/
