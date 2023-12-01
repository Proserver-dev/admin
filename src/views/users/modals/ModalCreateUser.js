import {Typography} from "@mui/material";
import React from "react";
import CustomModal from "../../../components/CustomModal";


const ModalCreateUser = ({open = false, setModalOpen = {}}) => {

    return (
        <CustomModal open={open} onClose={() => setModalOpen(false)}>
            <Typography variant="h6">Utwórz użytkownika</Typography>
        </CustomModal>
    )
}

export default ModalCreateUser