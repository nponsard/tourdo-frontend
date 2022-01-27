import { createContext, useState } from "react";
import { Fetcher } from "./fetcher";
import { User } from "./users";

export const LoginContext = createContext({
    user: null as User | null,
    accessToken: null as string | null,
    refreshToken: null as string | null,
    setAuth: (newUser: User, accessToken: string, refreshToken: string) => {},
});

export const GetCurrentUser = async (accessToken: string) => {
    return Fetcher<User>(`/api/v1/users/me`, {
        headers: { Authorization: `${accessToken}` },
    }).then((user) => {
        if (!user.username) throw new Error("Invalid user");

        return user;
    });
};

export const RefreshToken = async (refreshToken: string) => {
    return Fetcher<{ accessToken: string; refreshToken: string }>(
        `/api/v1/users/refresh`,
        {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
        }
    ).then((data) => {
        if (!data.accessToken || !data.refreshToken)
            throw new Error("Invalid token");

        return data;
    });
};

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
};

export const CheckLocalStorage = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken && refreshToken) {
        return { accessToken, refreshToken };
    }
    return null;
};
