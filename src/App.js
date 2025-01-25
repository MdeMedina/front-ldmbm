import React from "react";
import Home from "./components/Home";
import Appx from "./components/template/app";
import { VentaProductos } from "./components/VentaPartes";
import User from "./components/User";
import Login from "./components/Login";
import Logout from "./components/Logout";
import UpdateHour from "./components/Hour";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/home.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import { backendUrl } from "./lib/data/server";
import { AccountConfig } from "./components/AccountConfig";
import VistaInventario from "./components/VentaPartes/vistaInventario";
import Clientes from "./components/clientes";
import { Cliente } from "./components/clientes/cliente";
import Products from "./components/Products";
import Cotizaciones from "./components/cotizaciones";
function App() {
  let permissions = JSON.parse(localStorage.getItem("permissions"));
  let vm;
  let am;
  let dm;
  let mu;
  let du;
  if (permissions === null) {
    vm = false;
    am = false;
    dm = false;
    mu = false;
    du = false;
  } else {
    vm = permissions.verMovimientos;
    am = permissions.aprobarMovimientos;
    dm = permissions.eliminarMovimientos;
    mu = permissions.modificarUsuarios;
    du = permissions.eliminarUsuarios;
  }

  return (
    <Router>
      <Routes>
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Appx />}>
        <Route path="/pdf" element={<Cotizaciones />} />
          <Route path="/update" element={<UpdateHour />} />
          <Route path="/presupuestos" element={<VentaProductos />} />
          <Route
            path="/accountConfig"
            element={<AccountConfig />}
          />
          <Route
            path="/clientes"
            element={
              <Clientes
                verMovimientos={vm}
                aprobarMovimientos={am}
                eliminarMovimientos={dm}
              />
            }
          />
          <Route path="/clientes/:clienteId" element={<Cliente />} />
          <Route path="/presupuestos/:presuId" element={<VentaProductos />} />
          <Route
            path="/user"
            element={<User modUsuarios={mu} delUsuarios={du} />}
          />
          <Route
            path="/products"
            element={<Products />}
          />
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;