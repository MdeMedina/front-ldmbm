import React, { useState } from "react";
import "boxicons";
import { Link } from "react-router-dom";
import ModalComponent from "../modal/iframeModal";

function Sidebar(props) {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const createFunction = () => {
      return (
        <li className="nav-link">
          <Link to="/user">
            <div className="icon">
              <box-icon type="solid" color="#fff"  name="user-account" size="27px"></box-icon>
            </div>
            <span className="text nav-text">Usuarios</span>
          </Link>
        </li>
      );
  };

  const listaFunction = () => {

      return (
        <li className="nav-link">
          <Link to="/clientes">
            <div className="icon">
              <box-icon name="user" color="#fff" size="27px"></box-icon>
            </div>
            <span className="text nav-text">Clientes</span>
          </Link>
        </li>
      );
    
  };
  const movesFunction = () => {
      return (
        <li className="nav-link">
          <Link to="/presupuestos">
            <div className="icon">
              <box-icon name="money-withdraw" color="#fff" size="27px"></box-icon>
            </div>
            <span className="text nav-text">Presupuestos</span>
          </Link>
        </li>
      );

  };



  return (
    <>
      <nav className="sidebar" id="sidebar">
        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">
              <li className="caja-link ">
                <Link to="/">
                  <div className="icon">
                    <box-icon name="home-smile" color="#fff" size="27px"></box-icon>
                  </div>
                  <span className="text nav-text">Home</span>
                </Link>
              </li>
              {listaFunction()}
              {movesFunction()}
              <li className="caja-link ">
                <Link to="/products">
                  <div className="icon">
                    <box-icon name="store-alt" color="#fff" size="27px"></box-icon>
                  </div>
                  <span className="text nav-text">Productos</span>
                </Link>
              </li>
              <li className="caja-link ">
                <Link to="/pdf">
                  <div className="icon">
                    <box-icon name='file-pdf' type='solid' color='#ffffff' size="27px"></box-icon>
                  </div>
                  <span className="text nav-text">Presupuestos hechos</span>
                </Link>
              </li>
              {createFunction()}
            </ul>
          </div>
          <ModalComponent show={showModal} handleClose={handleCloseModal} />
          <div className="bottom-content">
            <li className="nav-link">
              <Link to="/logout">
                <div className="icon">
                  <box-icon name="log-out" color="#fff" size="27px"></box-icon>
                </div>
                <span className="text nav-text">Logout</span>
              </Link>
            </li>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;
