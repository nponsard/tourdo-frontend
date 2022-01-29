import {
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { LoginContext } from "../../utils/auth";
import { TournamentnTypeName, TournamentType } from "../../utils/tournaments";

export default function TournamentCreation() {
    const context = useContext(LoginContext);
    const router = useRouter();

    const [type, setType] = useState(TournamentType.None);

    console.log("user :", context.user);

    if (context.user === null) router.push("/");

    return (
        <>
            <Paper
                elevation={3}
                sx={{
                    maxWidth: "40rem",
                    p: "2rem",
                    marginRight: "auto",
                    marginLeft: "auto",
                }}
            >
                <Box component="form">
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Create a tournament
                    </Typography>

                    {/* type  */}
                    <FormControl fullWidth>
                        <InputLabel id="type-select-label">Tournament Type</InputLabel>
                        <Select
                            labelId="type-select-label"
                            value={type}
                            label="Tournament type"
                            onChange={(event) =>
                                setType(event.target.value as TournamentType)
                            }
                        >
                            {TournamentnTypeName.map((name, index) => (
                                <MenuItem key={index} value={index}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* name  */}
                



                    {/* start_date  */}
                    {/* end_date  */}
                    {/* description  */}
                    {/* max_teams  */}
                    {/* game_name  */}
                </Box>
            </Paper>
        </>
    );
}
