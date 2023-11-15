// component
import Iconify from '../../components/Iconify';
import RoutesPath from "../../constants/RoutesPath";
import {translate} from "../../helpers/i18n";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
    {
        title: translate("APP_MENU_HOME"),
        path: RoutesPath.HOME,
        icon: getIcon('dashicons:admin-home'),
    },
    {
        title: translate("APP_MENU_USER_ROLES"),
        path: RoutesPath.ROLES,
        icon: getIcon('dashicons:shield'),
    },
    {
        title: translate("APP_MENU_MESSAGES_TO_ALL"),
        path: RoutesPath.SEND_TO_ALL,
        icon: getIcon('dashicons:upload'),
    },
    {
        title: translate("APP_MENU_LOGS"),
        path: RoutesPath.LOGS,
        icon: getIcon('dashicons:list-view'),
    },
    {
        title: translate("APP_MENU_API_RESULTS"),
        path: RoutesPath.API_RESULTS,
        icon: getIcon('dashicons:rest-api'),
    },
    {
        title: translate("APP_MENU_APP_SETTINGS"),
        path: RoutesPath.APP_CONFIG,
        icon: getIcon('dashicons:admin-generic'),
    },
    {
        title: translate("APP_MENU_USER_LOCATIONS"),
        path: RoutesPath.MAP_USERS_LOCATION,
        icon: getIcon('dashicons:location-alt'),
    },
    {
        title: translate("APP_MENU_USER_LIST"),
        path: RoutesPath.USER_LIST,
        icon: getIcon('dashicons:admin-users'),
    }
];

export default navConfig;