import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Modal,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import { SearchUser, User } from "../types/users";
import UserSummary from "./UserSummary";
import { useState } from "react";

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

const OrganizerManager = ({
    organizers,
    addOrganizer,
    removeOrganizer,
}: {
    organizers: User[] | undefined;
    addOrganizer?: (user: User) => Promise<any>;
    removeOrganizer?: (user: User) => Promise<any>;
}) => {
    const [editMode, setEditMode] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState("");

    const { data: searchResult } = SearchUser(search);

    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [errorSnack, setErrorSnack] = useState(false);
    const [successSnack, setSuccessSnack] = useState(false);

    const addUsers = () => {
        setOpenModal(false);

        const promises = [];

        if (addOrganizer) {
            for (const user of selectedUsers) {
                promises.push(addOrganizer(user));
            }
        }
        Promise.allSettled(promises)
            .then(() => {
                setSuccessSnack(true);
            })
            .catch(() => {
                setErrorSnack(true);
            });
    };

    const removeUser = (user: User) => {
        setOpenModal(false);
        if (removeOrganizer) {
            removeOrganizer(user)
                .then(() => {
                    setSuccessSnack(true);
                })
                .catch(() => {
                    setErrorSnack(true);
                });
        }
    };

    return (
        <>
            <Snackbar
                open={successSnack}
                autoHideDuration={6000}
                onClose={() => setSuccessSnack(false)}
            >
                <Alert
                    onClose={() => setSuccessSnack(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Organizers successufuly modified
                </Alert>
            </Snackbar>
            <Snackbar
                open={errorSnack}
                autoHideDuration={6000}
                onClose={() => setErrorSnack(false)}
            >
                <Alert
                    onClose={() => setErrorSnack(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    An error occured
                </Alert>
            </Snackbar>
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6">Add an organizer</Typography>
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
                            addUsers();
                        }}
                    >
                        Add
                    </Button>
                    <Button onClick={() => setOpenModal(false)}>Cancel </Button>
                </Box>
            </Modal>
            <Box sx={{ marginBottom: "1rem" }}>
                {addOrganizer && (
                    <Button
                        variant="outlined"
                        sx={{ marginRight: "1rem" }}
                        onClick={() => setOpenModal(true)}
                    >
                        Add Organizer
                    </Button>
                )}
                {removeOrganizer && (
                    <Button
                        variant="outlined"
                        onClick={() => setEditMode(!editMode)}
                    >
                        Remove Organizer
                    </Button>
                )}
            </Box>

            {organizers?.map((user) => (
                <UserSummary
                    key={user.id}
                    user={user}
                    deleteAction={editMode ? () => removeUser(user) : undefined}
                />
            ))}
        </>
    );
};

export default OrganizerManager;
