import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Menu, MenuItem } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GeneralAppBar from "../components/GeneralAppBar";
import "../styles/globals.css";
import {
    FetchLogout,
    CheckLocalStorage,
    ClearLocalStorage,
    LoginContext,
    SaveLocalStorage,
    TokenPair,
} from "../utils/auth";
import { FetchCurrentUser, User } from "../utils/users";

function MyApp({ Component, pageProps }: AppProps) {
    // undefined : not yet loaded
    // null : not logged in
    const [user, setUser] = useState<User | undefined | null>(undefined);
    const [tokenPair, _setTokenPair] = useState<TokenPair | undefined | null>(undefined);

    const setTokenPair = (value: TokenPair | undefined | null) => {
        if (value) SaveLocalStorage(value);

        _setTokenPair(value);
    };

    // charge les tokens au lancement

    useEffect(() => {
        _setTokenPair(CheckLocalStorage());
    }, []);

    useEffect(() => {
        if (tokenPair) {
            FetchCurrentUser(tokenPair, setTokenPair)
                .then((data) => {
                    console.log("user", data);
                    if (data.id != undefined && data.username != undefined) {
                        setUser(data);
                    } else {
                        setUser(null);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setTokenPair(null);
                });
        } else if (tokenPair === null) {
            ClearLocalStorage();
            setUser(null);
        } else {
            setUser(undefined);
        }
    }, [tokenPair]);

    return (
        <LoginContext.Provider
            value={{
                user,
                setUser: (newUser: User | undefined | null) => setUser(newUser),
                tokenPair,
                setTokenPair: (newTokenPair: TokenPair | undefined | null) => setTokenPair(newTokenPair),
            }}
        >
            <Head>
                <title>TOURDO</title>
                <meta name="description" content="DO tournament manager" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <GeneralAppBar />

            <Box
                sx={{
                    maxWidth: "60rem",
                    marginRight: "auto",
                    marginLeft: "auto",
                    paddingRight: { sm: 0, md: "1rem" },
                    paddingLeft: { sm: 0, md: "1rem" },
                    paddingTop: "1rem",
                }}
            >
                <Component {...pageProps} />
            </Box>
        </LoginContext.Provider>
    );
}

export default MyApp;
