import React from "react";
import Navg from "../sub-components/nav";
import { Link } from "react-router-dom";
import Sidebar from "../sub-components/sidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { frontUrl } from "../../lib/data/server";
function Home() {
  const navigate = useNavigate();
  const key = localStorage.getItem("key");
  if (!key) {
    window.location.href = `${frontUrl()}/login`;
  }

  const permissions = JSON.parse(localStorage.getItem("permissions"));
  const hi = permissions.horasIngreso;
  const cu = permissions.crearUsuarios;
  const vm = permissions.verMovimientos;
  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    const navDiv = document.querySelector(".navDiv");
    console.log(navDiv);
    console.log(sidebar.classList.contains("close"));

    if (!sidebar.classList.contains("close")) {
      console.log("si lo tengo");
      sidebar.classList.toggle("close");
      // navDiv.classList.toggle("close");
    }
  }, []);

  return (
    <>
      <div class="row d-flex justify-content-center c-container">
        <div className="col-11">
          <h2>Bienvenido</h2>
        </div>
        {!vm ? (
          false
        ) : (
          <div className="col-xs-12 col-md-6 row d-flex justify-content-center mb-3">
            <div class="card cd col-10 cl">
              <img
                src={require("../img/users.jpg")}
                class="card-img-top "
                alt="..."
              />
              <div class="card-body ">
                <h5 class="card-title d-flex justify-content-center">
                  Clientes
                </h5>
                <p class="card-text d-flex justify-content-center">
                  Crea, visualiza, elimina y edita clientes
                </p>
                <Link to="/clientes" className="d-flex justify-content-center">
                  <btn class="toyox">Entrar</btn>
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className="col-xs-12 col-md-6 mb-3 row d-flex justify-content-center">
          {!cu ? (
            false
          ) : (
            <div class="card cd col-10 cl">
              <img
                src={require("../img/moves.jpg")}
                class="card-img-top cl"
                alt="..."
              />
              <div class="card-body ">
                <h5 class="card-title d-flex justify-content-center">
                  Presupuestos
                </h5>
                <p class="card-text d-flex justify-content-center">
                  Haz nuevos presupuestos para tus clientes
                </p>
                <Link to="/presupuestos" className="d-flex justify-content-center">
                  <btn class="toyox">Entrar</btn>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
