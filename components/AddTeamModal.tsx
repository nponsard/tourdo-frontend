import {
    Autocomplete,
    Box,
    Button,
    Modal,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { useState } from "react";
import { Team, useSearchTeams } from "../utils/teams";

const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "30rem",
    width: "100%",
    p:4,
};

export default function AddUserModal(props: {
    open: boolean;
    addTeams: (teams: Team[]) => any;
    close: () => any;
    title: string;
}) {
    const [search, setSearch] = useState("");
    const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);

    const { data: searchResult } = useSearchTeams(search);

    return (
        <Modal
            open={props.open}
            onClose={close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Paper sx={modalStyle}>
                <Typography variant="h6">{props.title}</Typography>
                <Stack spacing={2}>
                    <Autocomplete
                        multiple
                        options={searchResult ? searchResult.teams : []}
                        renderInput={(params) => (
                            <TextField {...params} label="Team" />
                        )}
                        getOptionLabel={(option) => option.name}
                        onInputChange={(_, value) => {
                            setSearch(value);
                        }}
                        onChange={(_, value) => {
                            setSelectedTeams(value);
                        }}
                        isOptionEqualToValue={(option, value) => {
                            return option.id === value.id;
                        }}
                    />

                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button onClick={props.close} color="secondary">
                            Cancel{" "}
                        </Button>
                        <Button
                            onClick={() => {
                                props.addTeams(selectedTeams);
                                props.close();
                            }}
                        >
                            Add
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Modal>
    );
}
