import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { backendUrl } from "../../lib/data/server";
import Swal from "sweetalert2";
import EditUProductModal from "../sub-components/modal/editUProduct";
import CreateProductModal from "../sub-components/modal/createUseProduct";

const Products = () => {
    const [buscar, setBuscar] = useState("");
    const [productos, setProductos] = useState([]);
    const [product, setProduct] = useState();
    const [cP, setCP] = useState(false);
    const [searching, setSearching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDocs, setTotalDocs] = useState(0);
    
    useEffect(() => {
      handleSearch(buscar, currentPage)
    }, [buscar ,currentPage]);

const eliminarProducto = (id) => {
  Swal.fire({
    title: 'Estas seguro que deseas eliminar este producto?',
    showDenyButton: true,
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: `Cancelar`,
    denyButtonText: `Eliminar`,
  }).then((result) => { if (result.isDenied) {
    Swal.fire({
      title: 'Estas seguro COMPLETAMENTE que deseas eliminar este producto?',
      showDenyButton: true,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: `Cancelar`,
      denyButtonText: `Eliminar`,
    }).then((result) => { if (result.isDenied) {
      removeProduct(id)

      }
    })
    }
  })
}

const settingCreateProduct = async (params) => {
    createUproduct(params)
}


    const createUproduct = async (params) => {
      const obj = {
        nombre: params.nombre,
        precio: params.precio,
        nota: params.notas
      }
      
      return fetch(`${backendUrl()}/uproducts/add`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(obj),
            })
              .then(r => r.json()).then(r => {
                console.log("Producto Creado: ",r)
                if (r.status === 201) {
                  setProductos(prevList => [...prevList, r.product])
                  Swal.fire({
                    icon: "success",
                    title: "Producto Creado con exito",
                    showConfirmButton: false,
                    timer: 1100
                  })
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


const removeProduct = async (id) => {
  await fetch(`${backendUrl()}/uproducts/delete`, {
    method: 'DELETE',
    body: JSON.stringify({_id: id}),
  headers: new Headers({ 'Content-type': 'application/json'})
}).then(r => {
  if (r.status === 200) {
  Swal.fire({
  icon: 'success',
  title: 'Producto Eliminado con exito',
}).then(() => {
  handleSearch("")
})} else {
  Swal.fire({
      icon: 'error',
      title: 'Algo extraño ha ocurrido',
    })
}
}).then(r => console.log(r))
}

const settingActProduct = (nombre, notas, precio, _id) => {
    actProduct(nombre, notas ,precio, _id)
  }

  const actProduct = async (nombre, nota, precio, _id ) => {
      let obj = {
        nombre,
        precio,
        nota,
        _id
      };
      
      console.log(obj)
    
        return fetch(`${backendUrl()}/uproducts/edit`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        })
          .then(r => r.json()).then(r => {
            console.log("Producto Actualizado: ",r)
            if (r.status === 200) {
              handleSearch("")
              Swal.fire({
                icon: "success",
                title: "Producto Actualizado con exito",
                showConfirmButton: false,
                timer: 1100
              })
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
    };
  

    const handleSearch = async (buscar, page) => {
        try {
          let response = await fetch(`${backendUrl()}/uproducts`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: buscar, page})
          }).then(setSearching(false));
          let data = await response.json();
          let pd = data.productos.map((d) => {
              return {
                name: d.name,
                price: d.price,
                note: d.note,
                tipo: "manual",
                _id: d._id
              };
          });

          setProductos([...pd]);
          setTotalDocs(data.total);
        } catch (e) {
          console.log(e);
          setSearching(false);
          alert("Ha ocurrido un error :(");
        }
      };

      const handlePageChange = (newPage) => {
        if (newPage < 1) return; // Evitar ir a páginas negativas
        setCurrentPage(newPage);
      };

      if (searching) return <><h2>Cargando productos...</h2></>

  return (
    <>
    <EditUProductModal
    show={product}
    nombre={product? product.name: ""}
    precio={product? product.price: ""}
    nota={product? product.note: ""}
    _id={product? product._id: ""}
    onHide={() => setProduct(null)}
    settingMounts={settingActProduct}
    ></EditUProductModal>
    <CreateProductModal 
                            show={cP}
                            onHide={() => setCP(false)}
                            settingmounts={settingCreateProduct}
                            pdf={false}
      />
  <div className="d-flex justify-content-center">
  <div className="container-fluid row  d-flex justify-content-center">
<div className="col-12 bg-light t-mod mt-3 p-4 row">
  
 <div className="col-12 d-flex justify-content-center mt-2 mb-2 row">

    <h2 className="row d-flex justify-content-center"><div className="col-sm-8 d-flex justify-content-center ">Productos Manuales</div> <div className="col-sm-4 ">
              <div className='toyox btn-cliente' onClick={() => setCP(true)} >
                <box-icon name='add-to-queue' type='solid' color='#ffffff' size="18px" ></box-icon> Producto manual
                </div>
              </div></h2>
  <div className="col-4 d-flex justify-content-center align-items-center">
  <label htmlFor="" className='lbl-cli'>Buscar Producto Manual</label>
  </div>
  <div className="col-8 d-flex ">
  <input type="text" onChange={
            (e) => setBuscar(e.target.value)
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
    productos.map((c, i) => {
      return (

        <Accordion.Item eventKey={i}>
          <Accordion.Header>{c.name}</Accordion.Header>
          <Accordion.Body className="row">
        <div className="col-xs-12 col-sm-6 mb-3" ><h6>Nombre:</h6> <div className="text">{c.name}</div></div><div className="col-xs-12 col-sm-6 mb-3"><h6>Precio sin iva:</h6> ${c.price}</div><br />
        <div className="col-12 mb-2"><h6>Descripcion:</h6><div className="text">{c.note}</div></div>
        <div className="col-12 d-flex justify-content-end">                    <btn class="btn btn-danger" onClick={() => {
                      eliminarProducto(c._id)
                    }}><box-icon name='trash' color='#ffffff' ></box-icon></btn>
                    <btn class="toyox btn-cliente" onClick={() => {
                      setProduct(c)
                    }}><box-icon name='edit-alt' type='solid' color='#ffffff' ></box-icon></btn></div>
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

export default Products;
