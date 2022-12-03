import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from '../js/Login';
import Register from '../js/Register';
import Admin from '../js/AdminPage';
import AddPlate from '../js/AddPlate';
import AddRestaurant from '../js/AddRestaurant';
import ConsultRestaurant from '../js/ConsultRestaurant';
import Welcome from '../js/Welcome';
import AddAdmin from '../js/AddAdmin';
import ConsultAdmin from '../js/ConsultAdmin';
import ConsultPlate from '../js/ConsultPlate';
import ConsultRider from '../js/ConsultRider';
import ConsultClient from '../js/ConsultClient';
import AddRider from '../js/AddRider';
import PageNotFound from '../js/PageNotFound';
import Value from '../js/Value';
import Client from '../js/ClientPage';
import ClientConsultRestaurant from '../js/ClientConsultRestaurant';
import ClientConsultOrder from '../js/ClientConsultOrder';
import AdminConsultOrder from '../js/AdminConsultOrder';
import Rider from '../js/RiderPage';
import RiderConsultOrder from '../js/RiderConsultOrder';
import ClientConsultPlate from '../js/ClientConsultPlate';
import { ROUTES, ROLES} from './constants';
import { PrivateRoute } from './privateRoute';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={ROUTES.LOGIN} component={Login} />
        <Route exact path={ROUTES.WELCOME} component={Welcome} />
        <Route exact path="/register" component={Register} />

        <Route exact path="/admin/consultRestaurant/:id/addPlate" component={AddPlate} />
        <Route exact path="/admin/addRestaurant" component={AddRestaurant} />
        <Route exact path={ROUTES.ADDADMIN} component={AddAdmin} />
        <Route exact path="/admin/addRider" component={AddRider} />
        <Route exact path="/admin/ConsultOrder" component={AdminConsultOrder} />
        <Route exact path="/admin/consultRestaurant/:id" component={ConsultRestaurant} />
        <Route exact path="/admin/consultAdmin/:id" component={ConsultAdmin} />
        <Route exact path="/admin/consultRestaurant/:id/consultPlate/:id" component={ConsultPlate} />
        <Route exact path="/admin/consultRider/:id" component={ConsultRider} />
        <Route exact path="/admin/consultClient/:id" component={ConsultClient} />
        <PrivateRoute path="/admin" roles={[ROLES.ADMIN]} component={Admin} />
        
        <Route exact path="/client/ConsultPlate" component={ClientConsultPlate} />
        <Route exact path="/client/consultRestaurant" component={ClientConsultRestaurant} />
        <Route exact path="/client/consultOrder" component={ClientConsultOrder} />
        <Route exact path="/client/orderRate" component={Value} />
        <PrivateRoute path="/client" roles={[ROLES.CLIENT]} component={Client} />

        <Route exact path="/rider/consultOrder" component={RiderConsultOrder} />
        <PrivateRoute path="/rider" roles={[ROLES.RIDER]} component={Rider} />

        <Route path="*" component={PageNotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;