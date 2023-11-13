import RoutesPath from "../constants/RoutesPath";
import {Navigate, useRoutes} from "react-router-dom";
import DashboardLayout from "../views/dashboard";
import HomeView from "../views/home/HomeView";
import RolesView from "../views/roles/RolesView";
import SendToAllView from "../views/sendToAll/SendToAllView";
import LogsView from "../views/logs/LogsView";
import ApiResultsView from "../views/apiResults/ApiResultsView";

export default function Router() {
    return useRoutes([
        {
            path: RoutesPath.HOME,
            element: <DashboardLayout />,
            children: [
                { path: RoutesPath.HOME, element: <HomeView /> },
                { path: RoutesPath.ROLES, element: <RolesView /> },
                { path: RoutesPath.SEND_TO_ALL, element: <SendToAllView /> },
                { path: RoutesPath.LOGS, element: <LogsView /> },
                { path: RoutesPath.API_RESULTS, element: <ApiResultsView /> }
            ],
        },
        { path: '*', element: <Navigate to={RoutesPath.HOME} replace /> },
    ]);
}