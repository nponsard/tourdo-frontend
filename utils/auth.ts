import { createContext, useState } from "react";
import { User } from "./users";

export const LoginContext = createContext({
    user: null as User | null,
    setAuth: (newUser: User, accessToken: string, refreshToken: string) => {},
});
