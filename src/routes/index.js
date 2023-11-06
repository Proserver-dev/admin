import RoutesPath from "../constants/RoutesPath";
import {Navigate, useRoutes} from "react-router-dom";
import DashboardLayout from "../views/dashboard";
import HomeView from "../views/home/HomeView";

export default function Router(props) {
    return useRoutes([
        {
            path: RoutesPath.HOME,
            element: <DashboardLayout {...props} />,
            children: [
                { path: RoutesPath.HOME, element: <HomeView {...props} /> }
            ],
        },
        { path: '*', element: <Navigate to={RoutesPath.HOME} replace /> },
    ]);
}