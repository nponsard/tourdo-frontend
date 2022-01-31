import {
    Autocomplete, Button,
    Modal,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import { useState } from "react";
import { SearchUser, User } from "../utils/users";

const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "30rem",
    width: "100%",
    p: 4,
};

export default function AddUserModal(props: {
    open: boolean;
    addUsers: (users: User[]) => any;
    close: () => any;
    title: string;
}) {
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const { data: searchResult } = SearchUser(search);

    return (
        <Modal
            open={props.open}
            onClose={close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Paper sx={modalStyle}>
                <Typography variant="h6">{props.title}</Typography>
                <Autocomplete
                    multiple
                    options={searchResult ? searchResult.users : []}
                    renderInput={(params) => (
                        <TextField {...params} label="User" />
                    )}
                    getOptionLabel={(option) => option.username}
                    onInputChange={(_, value) => {
                        setSearch(value);
                    }}
                    onChange={(_, value) => {
                        setSelectedUsers(value);
                    }}
                    isOptionEqualToValue={(option, value) => {
                        return option.id === value.id;
                    }}
                />

                <Button onClick={props.close} color="secondary">
                    Cancel{" "}
                </Button>
                <Button
                    onClick={() => {
                        props.addUsers(selectedUsers);
                        props.close();
                    }}
                >
                    Add
                </Button>
            </Paper>
        </Modal>
    );
}
