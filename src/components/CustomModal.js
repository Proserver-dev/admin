import React from "react";
import {animated, useSpring} from "@react-spring/web";
import PropTypes from "prop-types";
import {Backdrop, Box, IconButton, Modal} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const Fade = React.forwardRef(function Fade(props, ref) {
    const {
        children,
        in: open,
        onClick,
        onEnter,
        onExited,
        ownerState,
        ...other
    } = props;
    const style = useSpring({
        from: {opacity: 0},
        to: {opacity: open ? 1 : 0},
        onStart: () => {
            if (open && onEnter) {
                onEnter(null, true);
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited(null, true);
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {React.cloneElement(children, {onClick})}
        </animated.div>
    );
});

Fade.propTypes = {
    children: PropTypes.element.isRequired,
    in: PropTypes.bool,
    onClick: PropTypes.any,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
    ownerState: PropTypes.any,
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 400,
    width: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};
const CustomModal = ({children, open, onClose}) => {
    return (
        <Modal open={open} onClose={onClose}
               closeAfterTransition
               slots={{backdrop: Backdrop}}
               slotProps={{
                   backdrop: {
                       TransitionComponent: Fade,
                   },
               }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <IconButton
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            zIndex: 1,
                        }}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                    {children}
                </Box>
            </Fade>
        </Modal>
    )
}

export default CustomModal