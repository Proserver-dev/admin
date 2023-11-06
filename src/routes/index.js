import RoutesPath from "../constants/RoutesPath";
import {Navigate, useRoutes} from "react-router-dom";
import DashboardLayout from "../views/dashboard";
import HomeView from "../views/home/HomeView";

export default function Router({ setLoginToken }) {
    return useRoutes([
        {
            path: RoutesPath.HOME,
            element: <DashboardLayout setLoginToken={setLoginToken} />,
            children: [
                { path: '', element: <HomeView /> }
            ],
        },
        { path: '*', element: <Navigate to={RoutesPath.HOME} replace /> },
    ]);
}