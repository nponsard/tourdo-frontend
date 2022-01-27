import {
    Autocomplete,
    Box,
    Button,
    Input,
    Modal,
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
    addOrganizer?: (id: number) => Promise<any>;
    removeOrganizer?: (id: number) => Promise<any>;
}) => {
    const [editMode, setEditMode] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState("");

    const { data: searchResult } = SearchUser(search);

    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const addUser = (userID: number) => {
        setOpenModal(false);

        if (addOrganizer) addOrganizer(userID);
    };

    const addUsers = () => {
        setOpenModal(false);

        const promises = [];

        if (addOrganizer) {
            for (const user of selectedUsers) {
                promises.push(addOrganizer(user.id));
            }
        }
        Promise.allSettled(promises)
            .then(() => {



                
            })
            .catch(() => {



            });
    };

    return (
        <>
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

            {organizers?.map((entry) => (
                <UserSummary
                    key={entry.id}
                    user={entry}
                    deleteAction={editMode ? removeOrganizer : undefined}
                />
            ))}
        </>
    );
};

export default OrganizerManager;
