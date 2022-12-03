import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ROUTES } from './constants';
import { authenticationService } from '../services/authentication-service';
import axios from 'axios';

export const PrivateRoute = ({ component: Component, roles, ...rest }) => ( 
    <Route {...rest} render={props => {
        try {
            const user = authenticationService.currentUserValue;
            if (!user) {
                return <Redirect to={{ pathname: ROUTES.LOGIN, state: { from: props.location } }} />
            }
            if (roles && roles.indexOf(user.role) === -1) {
                return <Redirect to={{ pathname: '/'}} />
            }
            return <Component {...props} />
        }catch(err) {
            console.log(err);
        }
        
    }} />
)
/*
const dameRol = () => {
    var user = JSON.parse(localStorage.getItem('currentUser'));
    //console.log(user);
    if (user) {
        var email = user.email;
        var pwd = user.pwd;
        fetch(ROUTES.PROXY + '/user/dameRol', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pwd })
        }).then((rol) => {
                // store user details in local storage to keep user logged in between page refreshes
                console.log('--------->>>>'+ rol.text())
                return rol.text();
            })
    }
    return 'NADA';
}*/
