import React, {useState, useRef} from 'react'
import { useEffect } from 'react'
import {useReactToPrint} from 'react-to-print'
import Pagination from 'react-bootstrap/Pagination'
import Select from 'react-select'
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from 'react-router-dom'
import 'boxicons';
import {formatDateHoy} from '../dates/dates'
import '../../css/moves.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { backendUrl} from '../../lib/data/server';
import EModal from '../sub-components/modal/E-modal'
function Clientes() {
  let cantidadM = localStorage.getItem('cantidadM')
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


const [clientes, setClientes] = useState([])
const [Buscar, setBuscar] = useState("");

const [condicionBusqueda, setCondicionBusqueda] = useState({});
const [pagina, setPagina] = useState(1);
const [egresoShow, setEgresoShow] = React.useState(false);
const [vPage, setVPage] = useState(parseInt(cantidadM))
const [meEncuentro, setMeEncuentro] = useState(1)
const [estaba, setEstaba] = useState(1)
const [sortId, setSortId] = useState(0)
const [currentPage, setCurrentPage] = useState(1);
const [totalDocs, setTotalDocs] = useState(0);



const getClients = async (page) => {
  const response = await fetch(`${backendUrl()}/clients`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: Buscar, page})
  })
  let data = await response.json()
  console.log(data)
 setClientes(data.clientes)
 setTotalDocs(data.total)
}







const addCliente = async (nombre, RUT, correo, direccion, contacto, visita, observacion, giro, tipo) => {
  let obj = {
    nombre, 
    RUT, 
    correo, 
    direccion, 
    contacto, 
    visita,
    observacion,
    giro,
    tipo
  };
  
  let error = document.getElementById("error");
  if (!nombre) {

    if (error.classList.contains("desaparecer")) {
      error.classList.remove("desaparecer");
    }
  }  else if (!RUT) {

    if (error.classList.contains("desaparecer")) {
      error.classList.remove("desaparecer");
    }
  } else if (!direccion) {

    if (error.classList.contains("desaparecer")) {
      error.classList.remove("desaparecer");
    }
  } else {
    if (!error.classList.contains("desaparecer")) {
      error.classList.add("desaparecer");
    }

    return fetch(`${backendUrl()}/clients/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then(r => r.json()).then(r => {
        console.log("Cliente creado: ",r)
        if (r.status === 201) {
          setClientes(prevList => [...prevList, r.client])
          Swal.fire({
            icon: "success",
            title: "Cliente Creado con exito",
            showConfirmButton: false,
            timer: 1100
          }).then(setPagina(1))
        } else if (r.status === 403){
          Swal.fire({
            icon: "error",
            title: r.text,
            showConfirmButton: false,
            timer: 1100
          })
        } else {
          Swal.fire({
            icon: "error",
            title: "Algo extraño ha ocurrido",
            text: "Comuniquese con el administrador",
            showConfirmButton: false,
            timer: 1100
          })
        }
      });
  }
};

useEffect(() => {
  console.log(currentPage);
  
getClients(Buscar, currentPage)
}, [Buscar, currentPage]);




const settingMounts = (nombre, RUT, correo, direccion, contacto, visita, observacion, giro ,tipo) => {
  addCliente(nombre, RUT, correo, direccion, contacto, visita, observacion, giro, tipo)
}









useEffect(() => {
  let diff =  meEncuentro - estaba
  setCurrentPage(currentPage + (vPage * diff))
}, [estaba, meEncuentro])






const handleNameValue = (e) => {
  let values = e.map(item => item.value)
  if (!e.length) {
    setCondicionBusqueda(prev => ({...prev, name: ''}))
  }else {
    setCurrentPage(0)
    setEstaba(1)
    setMeEncuentro(1)
    setCondicionBusqueda(prev => ({...prev, name: values}))
  }
  }

let nombres = []

const handlePageChange = (newPage) => {
  if (newPage < 1) return; // Evitar ir a páginas negativas
  setCurrentPage(newPage);
};




return (
<>
  <div className="d-flex justify-content-center">
  <div className="container-fluid row  d-flex justify-content-center">
  <EModal
                      show={egresoShow}
                      onHide={() => setEgresoShow(false)}
                      settingMounts={settingMounts}
                    />
<div className="col-12 bg-light t-mod mt-3 p-4 row">
<h2  className=' row col-12' data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample"> <div className="col-6">Clientes</div>
<div className="col-6 d-flex justify-content-end">
 <div className="toyox btn-cliente" onClick={() => setEgresoShow(true)}>Crear cliente</div></div></h2> 
 <div className="col-12 align-self-start d-flex justify-content-start mt-2 mb-2 row">
  <div className="col-4 d-flex justify-content-center align-items-center">
  <label htmlFor="" className='lbl-cli'>Buscar Cliente</label>
  </div>
  <div className="col-8 d-flex ">
  <input type="text" onChange={
            (e) => setBuscar(e.target.value)
          } className='form-control' />
  </div>
  </div>

  
 
  <hr />
  <hr />
  <div className="col-6 d-flex justify-content-start align-items-center  mb-3">
 <span className="">{((currentPage-1)*10)+1}-{(currentPage)*10 < totalDocs ? ((currentPage)*10) : totalDocs} de {totalDocs} cotizaciones</span>
  </div>
  <div className="col-6 d-flex justify-content-end mb-3">
      <button
        className="toyox mx-2"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
      <box-icon name='chevron-left' color='#ffffff' ></box-icon>
      </button>
      <span className="d-flex align-items-center">{currentPage}</span>
      <button
        className="toyox mx-2"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={(currentPage)*10 > totalDocs}
      >
        <box-icon name='chevron-right' color='#ffffff' ></box-icon>
      </button>
    </div>
  <hr />
  <div className="tab-c col-12">
<table className="table">
<thead>
        <tr>
            <th ><div className='d-flex'></div></th>
            <th>Nombre</th>
            <th>Rut</th>
            <th>Direccion</th>
            <th>Visita </th>
        </tr>
    </thead>
    <tbody>

  {
    clientes.map((c, i) => {
      return (
        <tr className='tra'>
      <td key={c._id}><Link to={`/clientes/${c._id}`}><div className="toyox btn-vCliente">Ver cliente</div></Link></td>
                <td>{c.nombre}</td>
                <td >{c.RUT}</td>
                <td>{c.direccion}</td>
                <td >{c.visita}</td>
        </tr>

    )})
  }
  </tbody>
  </table>
  </div>
  <div className="col-12 d-flex justify-content-end">
  </div>


  </div>
  </div>
  </div>
</>
)
}

export default Clientes