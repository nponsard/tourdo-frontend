import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { createContext, useEffect, useState } from "react";
import { GetCurrentUser, User } from "../utils/users";
import {
    CallApi,
    CallLogout,
    CheckLocalStorage,
    ClearLocalStorage,
    LoginContext,
    SaveLocalStorage,
    TokenPair,
} from "../utils/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddIcon from "@mui/icons-material/Add";

function MyApp({ Component, pageProps }: AppProps) {
    // undefined : not yet loaded
    // null : not logged in

    const [user, setUser] = useState<User | undefined | null>(undefined);
    const [tokenPair, _setTokenPair] = useState<TokenPair | undefined | null>(
        undefined
    );

    const setTokenPair = (value: TokenPair | undefined | null) => {
        if (value) SaveLocalStorage(value);

        _setTokenPair(value);
    };

    const [validToken, setValidToken] = useState<boolean>(false);

    const router = useRouter();

    // charge les tokens au lancement

    useEffect(() => {
        _setTokenPair(CheckLocalStorage());
    }, []);

    useEffect(() => {
        if (tokenPair) {
            GetCurrentUser(tokenPair, setTokenPair)
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
            setUser(null);
        } else {
            setUser(undefined);
        }
    }, [tokenPair]);


    const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
        null
    );

    const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(
        null
    );
    const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchor(event.currentTarget);
    };
    const handleUserMenuClose = () => {
        setUserMenuAnchor(null);
    };

    const handleLogout = () => {
        if (tokenPair) {
            setUserMenuAnchor(null);
            CallLogout(tokenPair, setTokenPair)
                .then(() => {
                    ClearLocalStorage();
                    setTokenPair(null);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    return (
        <LoginContext.Provider
            value={{
                user,
                setUser: (newUser: User | undefined | null) => setUser(newUser),
                tokenPair,
                setTokenPair: (newTokenPair: TokenPair | undefined | null) =>
                    setTokenPair(newTokenPair),
                validToken,
                setValidToken: (newValidToken: boolean) =>
                    setValidToken(newValidToken),
            }}
        >
            <div>
                <Head>
                    <title>TOURDO</title>
                    <meta
                        name="description"
                        content="DO tournament manager"
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="sticky">
                        <Toolbar>
                            {/* <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton> */}
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ flexGrow: 1 }}
                            >
                                <Link href={"/"}>TourDO</Link>
                            </Typography>

                            {user === undefined && <div>loading</div>}

                            {tokenPair && user ? (
                                <>
                                    <IconButton
                                        color="inherit"
                                        size='large'
                                        onClick={(e) => {
                                            setAddMenuAnchor(e.currentTarget);
                                        }}
                                    >
                                        <AddIcon />
                                    </IconButton>

                                    <Menu
                                        id="user-menu"
                                        anchorEl={addMenuAnchor}
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        open={Boolean(addMenuAnchor)}
                                        onClose={() => {
                                            setAddMenuAnchor(null);
                                        }}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                setAddMenuAnchor(null);
                                                router.push(
                                                    `/create/tournament`
                                                );
                                            }}
                                        >
                                            Tournament
                                        </MenuItem>

                                        <MenuItem
                                            onClick={() => {
                                                setAddMenuAnchor(null);
                                                router.push(`/create/team`);
                                            }}
                                        >
                                            Team
                                        </MenuItem>
                                    </Menu>

                                    <Button
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleUserMenu}
                                        color="inherit"
                                        sx={{ textTransform: "none" }}
                                        endIcon={<ArrowDropDownIcon />}
                                    >
                                        {user.username}
                                    </Button>
                                    <Menu
                                        id="user-menu"
                                        anchorEl={userMenuAnchor}
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        open={Boolean(userMenuAnchor)}
                                        onClose={handleUserMenuClose}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                setUserMenuAnchor(null);
                                                router.push(
                                                    `/users/${user.id}`
                                                );
                                            }}
                                        >
                                            Profile
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                setUserMenuAnchor(null);
                                                router.push(`/password`);
                                            }}
                                        >
                                            Change password
                                        </MenuItem>
                                        <MenuItem onClick={handleLogout}>
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <Link href="/login" passHref>
                                    <Button color="inherit">Login</Button>
                                </Link>
                            )}
                        </Toolbar>
                    </AppBar>
                </Box>
            </div>

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
