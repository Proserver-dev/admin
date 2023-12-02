import {Stack, Typography} from "@mui/material";
import React from "react";
import CustomModal from "../../../components/CustomModal";


const ModalHTML = ({open = false, setModalOpen = {}, selectedRow = {}}) => {

    return (
        <CustomModal open={open} onClose={() => setModalOpen(false)}>
            <Stack direction="column" spacing={2}>
                <Typography variant="h6">Treść HTML</Typography>
                <div dangerouslySetInnerHTML={{ __html: selectedRow.html }} style={{ marginTop: '25px' }}/>
            </Stack>
        </CustomModal>
    )
}

export default ModalHTML