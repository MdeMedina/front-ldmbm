import { useEffect, useState }from 'react'
import Navg from '../sub-components/nav'
import Sidebar from '../sub-components/sidebar'
import { HexColorPicker } from "react-colorful";
import Pagination from 'react-bootstrap/Pagination'
import Select from 'react-select'
import 'boxicons'
import { backendUrl, frontUrl } from '../../lib/data/server';
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
import { gettingAccounts } from '../../lib/data/SelectOptions';
import ActModal from '../sub-components/modal/ActModal';
import CreateModal from '../sub-components/modal/createProductModal';
import ActProductModal from '../sub-components/modal/ActProductModal';
export const Cliente = () => {
const {clienteId} = useParams();
console.log(clienteId)
const ca = JSON.parse(localStorage.getItem('permissions')).configurarCuentas
const key = localStorage.getItem('key')
if (!key) {
  window.location.href=`${frontUrl()}/login`;
}
const navigate = useNavigate()
 const [cliente, setCliente] = useState({})
 const [productos, setProductos] = useState([])
 const [editShow, setEditShow] = useState(false)
 const urlPhotos = "https://res.cloudinary.com/dzktjoix0/image/upload/"
 const [createShow, setCreateShow] = useState(false)
 const [product, setProduct] = useState({data:{}, action: false});
 
 const [accountColor, setAccountColor] = useState('')
 const [accountChecked, setAccountChecked] = useState(true)
 const [cuentas, setCuentas] = useState([])
 const [_id, set_id] = useState('')
const [currentPage, setCurrentPage] = useState(0)
 const [estaba, setEstaba] = useState(1)
const [meEncuentro, setMeEncuentro] = useState(1)
const [deletingAccount, setDeletingAccount] = useState()
const [vPage, setVPage] = useState(10)
useEffect(() => {
  if (!ca) {
    navigate('/')
  }

  if (!key) {
    navigate("/login")
  }

}, [ca, key, navigate])

useEffect(() => {
  getClient()
  getProductos()
}, []);


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
useEffect(() => {
    let diff =  meEncuentro - estaba
    setCurrentPage(currentPage + (vPage * diff))
  }, [estaba, meEncuentro])



  const addProduct = async (nombre, nota, pid ) => {
    let obj = {
      nombre,
      nota,
      pid,
      cid: cliente._id
    };
    
  
      return fetch(`${backendUrl()}/products/add`, {
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
              title: "Cliente Creado con exito",
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

  const actProduct = async (nombre, nota, _id ) => {
    let obj = {
      nombre,
      nota,
      _id
    };
    
    console.log(obj)
  
      return fetch(`${backendUrl()}/products/edit`, {
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
            getProductos()
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

  const settingProduct = (nombre, precio, pid) => {
    addProduct(nombre, precio, pid)
  }

  const settingActProduct = (nombre, precio, _id) => {
    actProduct(nombre, precio, _id)
  }


  const eliminarProducto = (id, pid) => {
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
      removeProduct(id, pid)

      }
    })
    }
  })
}


const removeProduct = async (id, pid) => {
  console.log("rp:",pid)
  await fetch(`${backendUrl()}/products/delete`, {
    method: 'DELETE',
    body: JSON.stringify({_id: id}),
  headers: new Headers({ 'Content-type': 'application/json'})
}).then(r => {
  if (r.status === 200) {
  Swal.fire({
  icon: 'success',
  title: 'Producto Eliminado con exito',
}).then(() => {
  getProductos()
  deleteImage(pid)
})} else {
  Swal.fire({
      icon: 'error',
      title: 'Algo extraño ha ocurrido',
    })
}
}).then(r => console.log(r))
}

const deleteImage = async (publicId) => {
  const response = await fetch(`${backendUrl()}/photos/generate-signature-delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ public_id: publicId }),
  });

  console.log(publicId)

  const { signature, timestamp, cloud_name, api_key } = await response.json();

  // FormData para la solicitud a Cloudinary
  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("signature", signature);
  formData.append("api_key", api_key);
  formData.append("timestamp", timestamp);

  const url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/destroy`;

  try {
    const cloudinaryResponse = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const result = await cloudinaryResponse.json();

    if (result.result === "ok") {
      console.log("Imagen eliminada exitosamente");
    } else {
      console.error("Error al eliminar la imagen:", result);
    }
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
  }
};


  const getProductos = async () => {
    const response = await fetch(`${backendUrl()}/products`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({cid: clienteId})
    })
    let data = await response.json()
    console.log(data)
   setProductos(data.productos)
  }

const getClient = async () => {
  const response = await fetch(`${backendUrl()}/clients/get`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({id:clienteId})
  })
  let data = await response.json()
  console.log(data)
  if (data.status === 200){
    setCliente(data.cliente)
  } else {
    console.log(data)
  }
}

const editarCliente = async (nombre, RUT, correo, direccion, contacto, visita, observacion ) => {
  console.log("entre en editar cliente");
  
  let obj = {
    _id: cliente._id,
    nombre, 
    RUT, 
    correo, 
    direccion, 
    contacto, 
    visita,
    observacion
  };
  
  let error = document.getElementById("error");
  if (!nombre) {
    console.log("no hay nombre")
    if (error.classList.contains("desaparecer")) {
      error.classList.remove("desaparecer");
    }
  }  else if (!RUT) {
    console.log("no hay RUT")
    if (error.classList.contains("desaparecer")) {
      error.classList.remove("desaparecer");
    }
  } else if (!direccion) {
    console.log("no hay direccion")
    if (error.classList.contains("desaparecer")) {
      error.classList.remove("desaparecer");
    }
  } else {
    if (!error.classList.contains("desaparecer")) {
      error.classList.add("desaparecer");
    }

    return fetch(`${backendUrl()}/clients/edit`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then(r => r.json()).then(r => {
        console.log("Cliente creado: ",r)
        if (r.status === 200) {
          setCliente(null)
          setCliente(r.cliente)
          Swal.fire({
            icon: "success",
            title: "Cliente modificado con éxito!",
            showConfirmButton: false,
            timer: 1100
          }).then(setEditShow(false))
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

const eliminarCliente = () => {
        return(<button className='btn btn-danger' value={cliente._id} onClick={(e) => {
      Swal.fire({
        title: 'Estas seguro que deseas eliminar esta cuenta?',
        showDenyButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: `Cancelar`,
        denyButtonText: `Eliminar`,
      }).then((result) => { if (result.isDenied) {
        Swal.fire({
          title: 'Estas seguro COMPLETAMENTE que deseas eliminar esta cuenta?',
          showDenyButton: true,
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: `Cancelar`,
          denyButtonText: `Eliminar`,
        }).then((result) => { if (result.isDenied) {
          removeClient(cliente._id)
          }
        })
        }
      })

        }}>Eliminar</button>)
    }


    const settingMounts = (nombre, RUT, correo, direccion, contacto, visita, observacion) => {
      console.log("Entre en settingmounts")
      editarCliente(nombre, RUT, correo, direccion, contacto, visita, observacion)
    }

    const removeClient = async (id) => {
        await fetch(`${backendUrl()}/clients/delete`, {
          method: 'DELETE',
          body: JSON.stringify({_id: id}),
        headers: new Headers({ 'Content-type': 'application/json'})
      }).then(r => {
        if (r.status === 200) {
        Swal.fire({
        icon: 'success',
        title: 'Cuenta Eliminada con exito',
      }).then(navigate("/clientes"))} else {
        Swal.fire({
            icon: 'error',
            title: 'Algo extraño ha ocurrido',
          })
      }
    }).then(r => console.log(r))
      }
  





  return (
    <>
      <ActModal
                      show={editShow}
                      onHide={() => setEditShow(false)}
                      settingmounts={settingMounts}
                      cliente={cliente}
                    />
      <CreateModal
                      show={createShow}
                      onHide={() => setCreateShow(false)}
                      settingmounts={settingProduct}
                      cliente={cliente}
      />

      <ActProductModal 
                      show={product.action == "edit"}
                      onHide={() => setProduct({data: {}, action: ""})}
                      settingmounts={settingActProduct}
                      cliente={cliente}
                      product={product.data}
                      url={urlPhotos}
      />
      <div className="d-flex justify-content-center">
      <div className="container-fluid row  d-flex justify-content-center">
      <h1 className='mt-3'>Cliente: {cliente.nombre}</h1>
    <div className="col-12 bg-light t-mod p-4 row">
    <div className="col-12 mb-2">Datos del cliente:</div>
    <br />
    <div className="col-xs-4 col-sm-4 mb-2 ">
      <h6>Nombre:</h6>
      <div className="f-data">{cliente.nombre}</div>
    </div>
    <div className="col-xs-4 col-sm-4 mb-2 ">
      <h6>RUT:</h6> 
      <div className="f-data">{cliente.RUT}</div>
    </div>
    <div className="col-xs-8 col-sm-4 mb-2 ">
      <h6>Contacto:</h6> 
      <div className="f-data">{cliente.contacto}</div>
    </div>
    <div className="col-xs-8 col-sm-4 mb-2 ">
      <h6>Direccion:</h6> 
      <div className="f-data">{cliente.direccion}</div>
    </div>
    <div className="col-xs-8 col-sm-4 mb-2" >
      <div>
        <h6>Correo Electronico:</h6> 
        <div className="f-data">{cliente.correo}</div>
      </div>
    </div>
    <div className="col-xs-8 col-sm-4 mb-4">
        <h6>Visita:</h6> 
        <div className="f-data">{cliente.visita}</div>
    </div>
    <hr />
    <div className="col-12 mb-3">
        <h6>Observaciones:</h6> 
        <div className="o-data">{cliente.Observaciones}</div>
    </div>
    <div className="col-12 d-flex justify-content-end">{eliminarCliente()}<div className="btn toyox btn-cliente" onClick={() => setEditShow(true)}>Editar</div></div>
    </div>
    <div className="col-12 bg-light t-mod p-4 row">
      <h5 className='col-6 d-flex align-items-center'>Notas de productos </h5>
      <div className="col-6 d-flex justify-content-end"><div className="btn toyox btn-cliente mb-3 p-2" onClick={() => setCreateShow(true)}>Crear un producto</div></div>
      <hr />
      <div className="col-12 row">
            { productos.length > 0 ?
              productos.map((p, i) => { 
                return (
                <div class="card card-product m-1 overflow-auto col-xs-12 col-sm-3" key={i}>
                <img
                  src={`${urlPhotos}${p.photo_pid}.png?v=${new Date().getTime()}`}
                  class="card-img-top "
                  alt="..."
                />
                <div class="card-body-product ">
                  <h3 class="card-title-product d-flex justify-content-center">
                    {p.name}
                  </h3>
                  <h6 class="card-title-product d-flex justify-content-center">
                    {p.note ? p.note : false}
                  </h6>
                  <div className="d-flex justify-content-center">
                    <btn class="btn btn-danger" onClick={() => {
                      eliminarProducto(p._id, p.photo_pid)
                    }}><box-icon name='trash' color='#ffffff' ></box-icon></btn>
                    <btn class="toyox btn-cliente" onClick={() => {
                      setProduct({data: p, action:"edit"})
                    }}><box-icon name='edit-alt' type='solid' color='#ffffff' ></box-icon></btn>
                  </div>
                </div>
              </div>
                )
              }) :
              <div className="col-12 d-flex justify-content-center"> <h5>Este cliente no tiene notas de producto!</h5></div>
            }
      </div>
    </div>
    </div>
    </div>
    </>
  )
}
