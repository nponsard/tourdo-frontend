import { RefreshToken } from "./auth";

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

export const LoggedInFetcher = async <T>(
    url: string,
    tokens: { accessToken: string; refreshToken: string },
    setTokens: (tokens: { accessToken: string; refreshToken: string }) => void,
    init?: RequestInit | undefined
): Promise<T> => {
    const headers = {
        Authorization: `${tokens.accessToken}`,
    };

    const r = await fetch(url, {
        ...init,
        headers,
    });

    if (r.status == 401) {
        const newTokens = await RefreshToken(tokens.refreshToken);

        const headers = {
            Authorization: `${newTokens.accessToken}`,
        };

        const r = await fetch(url, {
            ...init,
            headers,
        });

        setTokens(newTokens);

        return r.json();
    }

    if (r.status >= 400) {
        return r.json().then((e) => {
            throw { message: e.message, status: r.status };
        });
    }
    return await r.json();
};
