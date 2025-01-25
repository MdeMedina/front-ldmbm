import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { backendUrl } from "../../lib/data/server";
import Swal from "sweetalert2";
import EditUProductModal from "../sub-components/modal/editUProduct";
import { Link } from "react-router-dom";

const Cotizaciones = () => {
    const [filename, setFilename] = useState("");
    const [cliente, setCliente] = useState("");
    const [totalDocs, setTotalDocs] = useState(0);

    const [vendedor, setVendedor] = useState("");
    const [pdf, setPdf] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [searching, setSearching] = useState(false);
    
    useEffect(() => {
      handleSearch(filename, cliente, vendedor, currentPage)
    }, [filename, cliente, vendedor, currentPage]);

    const formatMonto = (monto) => {
      return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2, // Mínimo de decimales
        maximumFractionDigits: 2, // Máximo de decimales
      }).format(monto);
    };

    const handlePageChange = (newPage) => {
      if (newPage < 1) return; // Evitar ir a páginas negativas
      setCurrentPage(newPage);
    };
    

    const handleSearch = async (filename, cliente, vendedor, page) => {
        try {
          let response = await fetch(`${backendUrl()}/cotizacion`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({filename, cliente, vendedor, page})
          }).then(setSearching(false));
          let data = await response.json();
          console.log(data)
          setPdf(data.cotizaciones);
          setTotalDocs(data.total)
        } catch (e) {
          console.log(e);
          setSearching(false);
          alert("Ha ocurrido un error :(");
        }
      };

      if (searching) return <><h2>Cargando cotizaciones...</h2></>

  return (
    <>

  <div className="d-flex justify-content-center">
  <div className="container-fluid row  d-flex justify-content-center">
<div className="col-12 bg-light t-mod mt-3 p-4 row">
 <div className="col-12 align-self-start d-flex justify-content-start mt-2 mb-2 row">
    <h1>Cotizaciones</h1>
    <h6>Filtrar por:</h6>
  <div className="col-4 d-flex justify-content-center align-items-center">
  <label htmlFor="" className='lbl-cli'>Nombre</label>
  </div>
  <div className="col-8 d-flex mb-2">
  <input type="text" onChange={
            (e) => setFilename(e.target.value)
          } className='form-control' />
  </div>
  <br />
  <div className="col-4 d-flex justify-content-center align-items-center">
  <label htmlFor="" className='lbl-cli'>Cliente</label>
  </div>
  <div className="col-8 d-flex mb-2">
  <input type="text" onChange={
            (e) => setCliente(e.target.value)
          } className='form-control' />
  </div>
  <br />
  <div className="col-4 d-flex justify-content-center align-items-center">
  <label htmlFor="" className='lbl-cli'>Vendedor</label>
  </div>
  <div className="col-8 d-flex ">
  <input type="text" onChange={
            (e) => setVendedor(e.target.value)
          } className='form-control' />
  </div>
  </div>

  
 
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
  <Accordion>
  {
    pdf.map((c, i) => {
      return (

        <Accordion.Item eventKey={i}>
          <Accordion.Header>{c.filename}</Accordion.Header>
          <Accordion.Body className="row">
        <div className="col-6 mb-3" ><h6>Cliente:</h6> <div className="text">{c.nom_cliente}</div></div><div className="col-6"><h6>Vendedor:</h6> {c.nom_vendedor}</div><br />
        <div className="col-12">
        <table class="table">
<thead>
<tr>
    <th class="tg-0pky"><div className='d-flex justify-content-center'>Nombre</div></th>
    <th class="tg-0pky"><div className='d-flex justify-content-center'>Precio</div></th>
    <th class="tg-0pky"><div className='d-flex justify-content-center'>Total sin Iva</div></th>
  </tr>
</thead>
<tbody>
 {c.productos ? c.productos.map((m, i) => {
  return (
    <tr>

      <td class="tg-0pky"><div className='d-flex justify-content-center'>{m.name}</div></td>
    <td class="tg-0pky"><div className='d-flex justify-content-center'>{m.price}</div></td>
    <td class="tg-0pky"><div className='d-flex justify-content-center'>{m.total}</div></td>
    </tr>
  )
 }): false}

</tbody>
</table>
        </div>
        <div className="col-12 d-flex justify-content-end mb-2"><h6>Total:  </h6><div className="text mx-2">${formatMonto(c.total)}</div></div>
        <div className="col-12 d-flex justify-content-end">                    
                    <Link to={`/presupuestos/${c._id}`}><btn class="btn btn-success" onClick={() => {
                    }}><box-icon name='duplicate' type='solid' color='#ffffff' ></box-icon> Duplicar</btn></Link></div>
          </Accordion.Body>
        </Accordion.Item>
     
    )})
  }
   </Accordion>
  </div>
  <div className="col-12 d-flex justify-content-end">
  </div>


  </div>
  </div>
  </div>
</>
  );
};

export default Cotizaciones;
