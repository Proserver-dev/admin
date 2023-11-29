import React from 'react';
import { Redirect } from 'react-router-dom';
import {getToken} from '../helpers/API/Auth';
import Routes from "../constants/Routes";

const RequireAuth = (component) => {
    if (getToken())
        return component;
    return  <Redirect to={Routes.LOGIN}/>;
};

export default RequireAuth;