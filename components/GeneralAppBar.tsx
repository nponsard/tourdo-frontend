import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import router from "next/router";
import { useContext, useState } from "react";
import { ClearLocalStorage, FetchLogout, LoginContext } from "../utils/auth";

export default function GeneralAppBar() {
    // const themeContext = useTheme() as { palette: { mode: "light" | "dark" } };

    const { user, tokenPair, setTokenPair } = useContext(LoginContext);

    const [addMenuAnchor, setAddMenuAnchor] = useState<HTMLElement | null>(null);
    const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null);

    const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchor(event.currentTarget);
    };
    const handleUserMenuClose = () => {
        setUserMenuAnchor(null);
    };

    const handleLogout = () => {
        if (tokenPair) {
            setUserMenuAnchor(null);
            FetchLogout(tokenPair, setTokenPair)
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
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6" component="div">
                    <Link href={"/"}>TourDO</Link>
                </Typography>
                {/* <IconButton onClick={toggleDarkMode}>
                    {themeContext.palette.mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton> */}

                <Box sx={{ flexGrow: 1 }} />

                {user === undefined && <div>loading</div>}

                {tokenPair && user ? (
                    <>
                        <IconButton
                            color="inherit"
                            size="large"
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
                                    router.push(`/create/tournament`);
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
                            {user.username} {user.admin && "(admin)"}
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
                                    router.push(`/users/${user.id}`);
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
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Link href="/login" passHref>
                        <Button color="inherit">Login</Button>
                    </Link>
                )}
            </Toolbar>
        </AppBar>
    );
}
