import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import NavDropdown from "react-bootstrap/NavDropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { formatDateHoyEn, formatDateMananaEn } from "../../dates/dates";
import Dropdown from "react-bootstrap/Dropdown";
import Swal from "sweetalert2";
import "boxicons";
import "../../../css/nav.css";
import { backendUrl, frontUrl } from "../../../lib/data/server";
import { PassModal } from "../modal/passModal";
import { faL } from "@fortawesome/free-solid-svg-icons";

function Navg({  }) {
  const navigate = useNavigate();
  const [apertura, setApertura] = useState();
  const [moves, setMoves] = useState([]);
  const [actPassword, setActPassword] = useState(false);
  const [filterMove, setfilterMove] = useState([]);
  const [note, setNote] = useState([]);
  const [cierre, setCierre] = useState();
  const [passShow, setPassShow] = useState();
  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const user = localStorage.getItem("name");
  let hourD = localStorage.getItem("HourAlert");
  const [alertDado, setAlertDado] = useState(hourD);
  const [aproveN, setAproveN] = useState([]);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (!document.hidden) {
        getInactive();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  const media = window.innerWidth;

  const settingPassword = (password, newPassword) => {
    setPassword(password);
    setNewPassword(newPassword);
    setActPassword(true);
  };

  const nuevaPass = async () => {
    if (actPassword === true) {
      let updateData = {
        email: localStorage.getItem("email"),
        ActualPassword: password,
        password: newPassword,
      };
      await fetch(`${backendUrl()}/users/actpass`, {
        method: "POST",
        body: JSON.stringify(updateData),
        headers: new Headers({ "Content-type": "application/json" }),
      }).then(
        Swal.fire({
          icon: "success",
          title: "Contraseña modificada con exito",
        })
      );
    }
  };

  useEffect(() => {
    nuevaPass();
  }, [actPassword]);

  const toggleFunc = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("close");
    const navDiv = document.querySelector(".navDiv");
    navDiv.classList.toggle("close");
  };
  /*const ap = ( time < 12) ? "<span>AM</span>":"<span>PM</span>";*/


  const getInactive = async () => {
    let updateData = { email: localStorage.getItem("email") };
    await fetch(`${backendUrl()}/users/inactive`, {
      method: "POST",
      body: JSON.stringify(updateData),
      headers: new Headers({ "Content-type": "application/json" }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        const promResult = await fetch(`${backendUrl()}/users/hour`);
        const jsq = await promResult.json();
        let horaActual = await jsq.horaActual;
        horaActual = horaActual.split("-");
        horaActual = `${horaActual[0]}-${horaActual[1]}-${horaActual[2]}`;
        let hora = res.hour;
        let actual = new Date(horaActual);
        let tiempo = new Date(actual) - new Date(hora);
        if (tiempo >= 3600000) {
          navigate("/logout");
        }
      });
  };

  const actInactive = async () => {
    let updateData = {
      email: localStorage.getItem("email"),
    };
    await fetch(`${backendUrl()}/users/actInactive`, {
      method: "PUT",
      body: JSON.stringify(updateData),
      headers: new Headers({ "Content-type": "application/json" }),
    });
  };

  useEffect(() => {
    getInactive();
    document.onclick = function () {
      actInactive();
    };
    window.setInterval(function () {
      getInactive();
    }, 3600000);
  }, []);
  let intervalo;




  return (
    <div className="ndG">
      <Navbar bg="#a2d9ff" className="topbar">
        <Container className="d-flex justify-content-center">
          <Row className="row-edit">
            {console.log(media > 414, media)}
            {media > 414 ? (
              <>
                {" "}
                <Col
                  xs={2}
                  md={2}
                  className="d-flex align-items-center justify-content-start p-0"
                >
                  <Navbar.Brand href="#home">
                    <img
                      src={require("../../img/logo.png")}
                      className="logo"
                      alt="..."
                    />
                  </Navbar.Brand>
                  <div id="number"></div>
                </Col>
                <Col xs={6} md={6} className="d-flex align-items-center justify-content-start">
                  <div onClick={toggleFunc}>
                    <Button className="btn-nav">
                      <box-icon name="menu" color="white" id="hola"></box-icon>
                    </Button>{" "}
                  </div>
                </Col>{" "}
              </>
            ) : (
              <>
                <Col xs={4} md={4} className="d-flex align-items-center">
                  <div onClick={toggleFunc}>
                    <Button className="btn-nav" >
                      <box-icon name="menu" color="white" id="hola"></box-icon>
                    </Button>{" "}
                  </div>
                </Col>
                <Col
                  xs={4}
                  md={4}
                  className="d-flex align-items-center justify-content-end"
                >
                  <Navbar.Brand
                    href="/"
                    className="d-flex justify-content-center"
                  >
                    <img
                      src={require("../../img/logo.png")}
                      className="logo"
                      alt="..."
                    />
                  </Navbar.Brand>
                  <div id="number"></div>
                </Col>
              </>
            )}

            <Col
              xs={4}
              md={4}
              className="d-flex align-items-center justify-content-end"
            >
              <div className="row d-flex align-items-center justify-content-end">
                <div class="dropstart col-6 d-flex justify-content-end">
                  <a
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user}
                  </a>
                  <ul class="dropdown-menu dropdown-menu-lg-start">
                    <li className="row">
                      <div className="col-11 d-flex justify-content-center">
                        Hora de ingreso:
                      </div>
                      <div className="fw-semibold d-flex justify-content-center">
                        {apertura}
                      </div>
                    </li>
                    <li className="row">
                      <div className="col-11 d-flex justify-content-center">
                        Hora de Cierre:
                      </div>
                      <div className="fw-semibold d-flex justify-content-center">
                        {cierre}
                      </div>
                    </li>
                    <hr />
                    <li className="row">
                      <a
                        onClick={() => setPassShow(true)}
                        className="d-flex justify-content-center cc"
                      >
                        Cambiar contraseña
                      </a>
                      <PassModal
                        show={passShow}
                        onHide={() => setPassShow(false)}
                        settingMounts={settingPassword}
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Navbar>
    </div>
  );
}

export default Navg;
