// component
import Iconify from '../../components/Iconify';
import RoutesPath from "../../constants/RoutesPath";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
    {
        title: 'home',
        path: '/',
        icon: getIcon('dashicons:admin-home'),
    }
];

export default navConfig;