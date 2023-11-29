import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {Link as RouterLink, useLocation, useNavigate} from 'react-router-dom';
// material
import {styled} from '@mui/material/styles';
import {Box, Link, Button, Drawer, Typography, Avatar, Stack} from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import NavSection from '../../components/NavSection';
//
import Label from "../../components/Label";
import LogoutIcon from '@mui/icons-material/Logout';
import Settings from "../../constants/Settings";
import {reqUserLogout} from "../../helpers/Auth";
import {useDispatch, useSelector} from "react-redux";
import {setSnackBar} from "../../redux/actions";
import RoutesPath from "../../constants/RoutesPath";
import Logo from "../../assets/rideclub_logo.png";
import {useTranslation} from "react-i18next";

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
    isOpenSidebar: PropTypes.bool,
    onCloseSidebar: PropTypes.func,
};

const RootStyle = styled('div')(({theme}) => ({
    [theme.breakpoints.up('lg')]: {
        flexShrink: 0,
        width: DRAWER_WIDTH,
    },
}));

const AccountStyle = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    backgroundColor: theme.palette.grey[500_12],
}));

export default function DashboardSidebar({isOpenSidebar, onCloseSidebar}) {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.currentUser);
    const isSocketConnected = useSelector((state) => state.socket);

    const {pathname} = useLocation();
    const isDesktop = useResponsive('up', 'lg');

    useEffect(() => {
        if (isOpenSidebar) {
            onCloseSidebar();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const handleLogout = async () => {
        dispatch({type: 'SHOW_SPINNER'});
        reqUserLogout()
            .then(res => {
                navigate(RoutesPath.HOME)
                dispatch({type: 'DISCONNECT_SOCKET'});
                dispatch({type: 'LOGOUT_CURRENT_USER'});
                dispatch(setSnackBar({type: 'success', message: t("APP_SUCCESS_LOGOUT"), show: true}))
            })
            .catch(err => {
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({type: 'error', message: message, show: true}));
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch({type: 'HIDE_SPINNER'});
                }, 250);
            })
    }

    const renderContent = (
        <>
            <Box sx={{px: 2.5, py: 2.5, display: 'inline-flex', justifyContent: 'center'}}>
                <img src={Logo} alt={Settings.TITLE} style={{maxWidth: '100px', width: '100%'}}/>
            </Box>

            <Box sx={{mb: 5, mx: 2.5}}>
                <AccountStyle>
                    <Avatar alt=""/>
                    <Box sx={{ml: 2, textAlign: 'center'}}>
                        <Typography variant="subtitle2" sx={{color: 'text.primary'}}>
                            {currentUser?.nameLastname || currentUser?.userName || currentUser?.email}
                        </Typography>
                        <Label variant="ghost" color="error">
                            {currentUser?.role?.name}
                        </Label>
                    </Box>
                </AccountStyle>
            </Box>

            <NavSection/>

            <Box sx={{flexGrow: 1}}/>

            <Box sx={{px: 2.5, pb: 3, mt: 10}}>
                <Stack alignItems="center" spacing={3} sx={{pt: 5, borderRadius: 2, position: 'relative'}}>
                    {!isSocketConnected && (
                        <p style={{color: 'red'}}>{t("APP_YOU_ARE_NOT_CONNECTED_WITH_SOCKET")}</p>
                    )}
                    <Button onClick={handleLogout} target="_blank" variant="contained" color="error"
                            startIcon={<LogoutIcon/>}>
                        {t("APP_LOGOUT_BTN_LABEL")}
                    </Button>
                </Stack>
            </Box>
        </>
    );

    return (
        <RootStyle>
            {!isDesktop && (
                <Drawer
                    open={isOpenSidebar}
                    onClose={onCloseSidebar}
                    PaperProps={{
                        sx: {width: DRAWER_WIDTH},
                    }}
                >
                    {renderContent}
                </Drawer>
            )}

            {isDesktop && (
                <Drawer
                    open
                    variant="persistent"
                    PaperProps={{
                        sx: {
                            width: DRAWER_WIDTH,
                            bgcolor: 'background.default',
                            borderRightStyle: 'dashed',
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            )}
        </RootStyle>
    );
}