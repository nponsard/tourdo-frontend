import {
    Autocomplete,
    Box,
    Button,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { SearchUser, User } from "../utils/users";

const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

export default function AddUserModal(props: {
    show: boolean;
    addUsers: (users: User[]) => any;
    close: () => any;
    title: string;
}) {
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const { data: searchResult } = SearchUser(search);

    return (
        <Modal
            open={props.show}
            onClose={close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
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

                <Button
                    onClick={() => {
                        props.addUsers(selectedUsers);
                        props.close();
                    }}
                >
                    Add
                </Button>
                <Button onClick={props.close}>Cancel </Button>
            </Box>
        </Modal>
    );
}
