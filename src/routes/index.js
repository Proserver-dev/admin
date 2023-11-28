import RoutesPath from "../constants/RoutesPath";
import {Navigate, useRoutes} from "react-router-dom";
import DashboardLayout from "../views/dashboard";
import HomeView from "../views/home/HomeView";
import RolesView from "../views/roles/RolesView";
import SendToAllView from "../views/sendToAll/SendToAllView";
import LogsView from "../views/logs/LogsView";
import ApiResultsView from "../views/apiResults/ApiResultsView";
import AppConfigView from "../views/appConfig/AppConfigView";
import MapUsersLocationView from "../views/mapUsersLocation/MapUsersLocationView";
import UserListView from "../views/users/UserListView";
import SendEmailHistoryView from "../views/sendEmailHistory/SendEmailHistoryView";

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
                { path: RoutesPath.API_RESULTS, element: <ApiResultsView /> },
                { path: `${RoutesPath.APP_CONFIG}/:typeParam`, element: <AppConfigView /> },
                { path: RoutesPath.MAP_USERS_LOCATION, element: <MapUsersLocationView /> },
                { path: RoutesPath.USER_LIST, element: <UserListView /> },
                { path: RoutesPath.SEND_EMAIL_HISTORY, element: <SendEmailHistoryView /> }
            ],
        },
        { path: '*', element: <Navigate to={RoutesPath.HOME} replace /> },
    ]);
}