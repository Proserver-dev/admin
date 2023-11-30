import {useState} from 'react';
import PropTypes from 'prop-types';
import {NavLink as RouterLink, matchPath, useLocation} from 'react-router-dom';
// material
import {alpha, useTheme, styled} from '@mui/material/styles';
import {Box, List, Collapse, ListItemText, ListItemIcon, ListItemButton} from '@mui/material';
//
import Iconify from './Iconify';
import RoutesPath from "../constants/RoutesPath";
import {useTranslation} from "react-i18next";

// ----------------------------------------------------------------------

const ListItemStyle = styled((props) => <ListItemButton disableGutters {...props} />)(({theme}) => ({
    ...theme.typography.body2,
    height: 48,
    position: 'relative',
    textTransform: 'capitalize',
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius,
}));

const ListItemIconStyle = styled(ListItemIcon)({
    width: 22,
    height: 22,
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

// ----------------------------------------------------------------------

NavItem.propTypes = {
    item: PropTypes.object,
    active: PropTypes.func,
};

function NavItem({item, active}) {
    const theme = useTheme();

    const isActiveRoot = active(item.path);

    const {title, path, icon, info, children} = item;

    const [open, setOpen] = useState(isActiveRoot);

    const handleOpen = () => {
        setOpen((prev) => !prev);
    };

    const activeRootStyle = {
        color: 'primary.main',
        fontWeight: 'fontWeightMedium',
        bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    };

    const activeSubStyle = {
        color: 'primary.main',
        fontWeight: 'fontWeightMedium',
        bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    };

    if (children) {
        return (
            <>
                <ListItemStyle
                    onClick={handleOpen}
                    sx={{
                        ...(isActiveRoot && activeRootStyle),
                    }}
                >
                    <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
                    <ListItemText disableTypography primary={title}/>
                    {info && info}
                    <Iconify
                        icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
                        sx={{width: 16, height: 16, ml: 1}}
                        style={{paddingRight: '15px'}}
                    />
                </ListItemStyle>

                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding style={{backgroundColor: '#fafafa'}}>
                        {children.map((item) => {
                            const {title, path} = item;
                            const isActiveSub = active(path);

                            return (
                                <ListItemStyle
                                    key={title}
                                    component={RouterLink}
                                    to={path}
                                    sx={{
                                        ...(isActiveSub && activeSubStyle),
                                    }}
                                >
                                    {item.icon ? (
                                        <ListItemIconStyle style={{ paddingLeft: '15px' }}>{item.icon && item.icon}</ListItemIconStyle>
                                    ) : (
                                        <ListItemIconStyle style={{ paddingLeft: '15px' }}>
                                            <Box
                                                component="span"
                                                sx={{
                                                    width: 4,
                                                    height: 4,
                                                    display: 'flex',
                                                    borderRadius: '50%',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    bgcolor: 'text.disabled',
                                                    transition: (theme) => theme.transitions.create('transform'),
                                                    ...(isActiveSub && {
                                                        transform: 'scale(2)',
                                                        bgcolor: 'primary.main',
                                                    }),
                                                }}
                                            />
                                        </ListItemIconStyle>
                                    )}
                                    <ListItemText disableTypography primary={title}/>
                                </ListItemStyle>
                            );
                        })}
                    </List>
                </Collapse>
            </>
        );
    }

    return (
        <ListItemStyle
            component={RouterLink}
            to={path}
            sx={{
                ...(isActiveRoot && activeRootStyle),
            }}
        >
            <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
            <ListItemText disableTypography primary={title}/>
            {info && info}
        </ListItemStyle>
    );
}

NavSection.propTypes = {
    navConfig: PropTypes.array,
};

export default function NavSection({...other}) {
    const {pathname} = useLocation();
    const {t, i18n} = useTranslation();

    const getIcon = (name) => <Iconify icon={name} width={22} height={22}/>;

    const navConfig = [
        {
            title: t("APP_MENU_HOME"),
            path: RoutesPath.HOME,
            icon: getIcon('dashicons:admin-home'),
        },
        {
            title: t("APP_MENU_MESSAGES_TO_ALL"),
            path: RoutesPath.SEND_TO_ALL,
            icon: getIcon('dashicons:upload'),
        },
        {
            title: t("APP_MENU_USERS_SECTION"),
            icon: getIcon('dashicons:admin-users'),
            children: [
                {
                    title: t("APP_MENU_USER_LIST"),
                    path: RoutesPath.USER_LIST,
                    icon: getIcon('dashicons:list-view'),
                },
                {
                    title: t("APP_MENU_USER_ROLES"),
                    path: RoutesPath.ROLES,
                    icon: getIcon('dashicons:shield'),
                },
                {
                    title: t("APP_MENU_USER_LOCATIONS"),
                    path: RoutesPath.MAP_USERS_LOCATION,
                    icon: getIcon('dashicons:location-alt'),
                },
            ]
        },
        {
            title: t("APP_MENU_APP_SETTINGS"),
            icon: getIcon('dashicons:admin-generic'),
            children: [
                {
                    title: t("APP_MENU_APP_SETTINGS_MAIN"),
                    path: RoutesPath.APP_CONFIG_MAIN
                },
                {
                    title: t("APP_MENU_APP_SETTINGS_PASSWORD"),
                    path: RoutesPath.APP_CONFIG_PASSWORD
                },
            ],
        },
        {
            title: t("APP_MENU_DEBUG_SECTION"),
            icon: getIcon('dashicons:admin-tools'),
            children: [
                {
                    title: t("APP_MENU_LOGS"),
                    path: RoutesPath.LOGS,
                    icon: getIcon('dashicons:list-view'),
                },
                {
                    title: t("APP_MENU_API_RESULTS"),
                    path: RoutesPath.API_RESULTS,
                    icon: getIcon('dashicons:rest-api'),
                },
                {
                    title: t("APP_MENU_SEND_EMAIL_HISTORY"),
                    path: RoutesPath.SEND_EMAIL_HISTORY,
                    icon: getIcon('dashicons:email-alt2'),
                },
            ],
        },
    ];

    const match = (path) => (path ? path === pathname : false);

    return (
        <Box {...other}>
            <List disablePadding sx={{p: 1}}>
                {navConfig.map((item) => (
                    <NavItem key={item.title} item={item} active={match}/>
                ))}
            </List>
        </Box>
    );
}