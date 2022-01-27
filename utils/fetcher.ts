export const Fetcher = <T>(
    url: string,
    init?: RequestInit | undefined
): Promise<T> => {
    return fetch(url, init).then((r) => {
        if (r.status >= 400) {
            return r.json().then((e) => {
                throw e;
            });
        }

        return r.json();
    });
};
