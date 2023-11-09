// component
import Iconify from '../../components/Iconify';
import RoutesPath from "../../constants/RoutesPath";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
    {
        title: 'home',
        path: RoutesPath.HOME,
        icon: getIcon('dashicons:admin-home'),
    },
    {
        title: 'role użytkowników',
        path: RoutesPath.ROLES,
        icon: getIcon('dashicons:shield'),
    },
    {
        title: 'Wiadomości do wszystkich',
        path: RoutesPath.SEND_TO_ALL,
        icon: getIcon('dashicons:upload'),
    }
];

export default navConfig;