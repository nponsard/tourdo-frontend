import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useContext } from "react";
import { LoginContext } from "../../utils/auth";

export default function TournamentCreation() {
    const context = useContext(LoginContext);
    const router = useRouter();

    console.log("user :",context.user);

    if (context.user === null) router.push("/");

    return (
        <>
            <Box component="form"></Box>
        </>
    );
}
