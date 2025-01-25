import React from 'react'
import Home from "./Home";
import Caja from "./Caja";
import User from "./User";
import UpdateHour from "./Hour";
import Moves from "./movimientos";
import { AccountConfig } from "./AccountConfig";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Clientes from './clientes';
import { Cliente } from './clientes/cliente';

function InApp ({ vm, am, dm, mu, du}) {
  return (
    <>
    <Router>
    <Switch>
    <Route path="/update">
          <UpdateHour />
        </Route>
        <Route path="/accountConfig">
          <AccountConfig  />
        </Route>
        <Route path="/caja">
          <Caja  />
        </Route>
        <Route path="/clientes">
          <Clientes
            verMovimientos={vm}
            aprobarMovimientos={am}
            eliminarMovimientos={dm}
          />
        </Route>
        <Route path="/clientes/:clienteId" element={<Cliente />} />
        <Route path="/user">
          <User modUsuarios={mu} delUsuarios={du} />
        </Route>
        <Route path="/">
          <Home />
        </Route>
    </Switch>
    </Router>
    </>
  )
}

export default InApp
