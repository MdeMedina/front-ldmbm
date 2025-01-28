import React, { useState, useEffect } from 'react';
import { read, utils, writeFile } from 'xlsx';
import 'boxicons'
import Select from 'react-select'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import {PDFDownloadLink, pdf} from '@react-pdf/renderer';
import MyDocument from './documento';
import { backendUrl, frontUrl } from '../../lib/data/server';
import MultiAttachmentInput from './multi';
import SearchModal from '../sub-components/modal/SearchModal';
import CreateProductModal from '../sub-components/modal/createUseProduct';
import { useParams } from 'react-router-dom';



const components = {
  DropdownIndicator: 'hola'
};
export const VentaProductos = () => {
const {presuId} = useParams();
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


  let hora
  let vc = JSON.parse(localStorage.getItem("permissions")).verClientes;
  let cv = JSON.parse(localStorage.getItem("cVend"))
  let vendedor = {nombre: localStorage.getItem("name"), email: localStorage.getItem("email")}

    const [cargaClientes, setCargaClientes] = useState()
    const [statusCliente, setStatusCliente] = useState(null)
    const [statusProducto, setStatusProducto] = useState(null) 
    
    const [totalIva, setTotalIva] = useState(0);
    const [iva, setIva] = useState(0);
    const [cargaProductos, setCargaProductos] = useState()
    const [menu1, setMenu1] = useState(false);
    const [menu2, setMenu2] = useState(false);
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [photo_pid, setPhoto_pid] = useState("");
    
     const urlPhotos = "https://res.cloudinary.com/dzktjoix0/image/upload/"
    const [selectedClient, setSelectedClient] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedProductE, setSelectedProductE] = useState(null)
    const [productosE, setProductosE] = useState([])
    const [archivoClientes, setarchivoClientes] = useState('');
    const [archivoProductos, setarchivoProductos] = useState('');
    const [sendFecha, setSendFecha] = useState('');
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pdfName, setPdfName] = useState('')
    const [logs, setLogs] = useState([]);
    
    const [Corr, setCorr] = useState(0);
    const [newCorr, setNewCorr] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [cliente, setCliente] = useState('');
    const [sC, setSC] = useState('');
    const [sP, setSP] = useState('');
    const [clientes, setClientes] = useState([]);
    const [partes, setPartes] = useState([]);
    const [cP, setCP] = useState(false);
    const [product, setProduct] = useState('');
    const [dataClient, setDataClient] = useState([]);
    const [dataProducts, setDataProducts] = useState([]);
    const [corDesx, setCorDesx] = useState(false);
    const [rif, setRif] = useState('');
    const [precioMayor, setPrecioMayor] = useState('');
    const [precioOferta, setPrecioOferta] = useState('');
    const [existencia, setexistencia] = useState(0);
    const [precioMenor, setPrecioMenor] = useState('');
    const [código, setCódigo] = useState('');
    const [nombreCorto, setNombreCorto] = useState('');
    const [nota, setNota] = useState('')
    const [total, setTotal] = useState(0);
    const [items, setItems] = useState('');
    const [marca, setMarca] = useState('');
    const [referencia, setReferencia] = useState('');
    
    const [preShoppingCart, setPreShoppingCart] = useState([])
    const [shoppingCart, setShoppingCart] = useState([])
    const [correoCliente, setCorreoCliente] = useState(false)
    const [correoMsn, setCorreoMsn] = useState('')
    const [search, setSearch] = useState(false);
    
    const [fecha, setFecha] = useState('')
    const [sended, setSended] = useState([])
    const [mostrarSended, setMostrarSended] = useState([])
    const [cotiActual, setCotiActual] = useState(null);
    const [cot, setCot] = useState(null);
    
    const [cantidadCor, setCantidadCor] = useState(0);
    let usuario = localStorage.getItem("name")
    console.log(usuario)

    useEffect(() => {
      if (presuId)
        getCotizacion(presuId)
    }, [presuId]);
    
    useEffect(() => {
      console.log(cliente);
      ;
    

    }, [cliente]);
    

// Función para registrar diferencias entre objetos
function deepCompare(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepCompare(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

const getCotizacion = async (id) => {
  let response = await fetch(`${backendUrl()}/cotizacion/get`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({_id: id})
  })
  let data = await response.json()

  let {_id, ...dest} = data.cotizacion
  console.log("dest:",dest.productos);
  
  setCotiActual(dest)
  setPreShoppingCart(dest.productos)
  setSelectedClient({value: dest.cliente_id, label: dest.nom_cliente})
}

useEffect(() => {
  const newCot = {
    cliente_id: cliente._id,
    nom_cliente: cliente.nombre,
    productos: preShoppingCart,
    total,
    totalIva,
    iva,
    fecha: getFormattedDate(),
    vendedor_id: vendedor.email,
    nom_vendedor: vendedor.nombre,
    observaciones: nota,
    corr: Corr - 1,
    filename: `Pedido n°${Corr - 1} - ${getFormattedDate()}.pdf`,
  };

  setCot((prevCot) => {
    // Crea una copia del objeto newCot para evitar modificar el original
    const filteredCot = {
      ...newCot,
      productos: newCot.productos?.map((producto) =>
        Object.fromEntries(
          Object.entries(producto).filter(([_, value]) => value !== undefined)
        )
      ),
    };
  
    // Verifica si hay diferencias entre el estado actual y el nuevo objeto filtrado
    if (!deepCompare(prevCot, filteredCot)) {
      console.log(filteredCot);
      return filteredCot;
    }
  
    // Mantén el estado actual si no hay cambios
    return prevCot;
  });
}, [Corr, cliente, iva, nota, preShoppingCart, total, totalIva, vendedor]);


useEffect(() => {

if (preShoppingCart.length) {
  setTotal(preShoppingCart.reduce((sum, item) => sum + parseFloat(item.total), 0));

  let sp = preShoppingCart.map(p => {
    console.log(p);
    
    // Copiar el objeto excluyendo photo_pid si es undefined
    let { photo_pid, ...rest } = p;
    let updatedItem = { ...rest, total: formatMonto(p.total), price: formatMonto(p.price) };

    // Solo agregar photo_pid si no es undefined
    if (photo_pid !== undefined) {
      updatedItem.photo_pid = photo_pid;
    }

    return updatedItem;
  });

  setShoppingCart(sp);
} else {
  setShoppingCart([]);
}
}, [preShoppingCart]);

useEffect(() => {
  if (total) {
    setTotalIva(parseFloat(total) + (parseFloat(total) * 0.19))
    setIva(parseFloat(total) * 0.19)
  }
}, [total]);
  useEffect(() => {
    if (selectedClient) {
      getClient(selectedClient.value)
      getProductosE(selectedClient.value)
    }
    }, [selectedClient]);



    useEffect(() => {
      console.log("Actualizacion de Corr: ", Corr);
    }, [Corr]);

    useEffect(() => {
      getCorr();
    
    }, []);

    useEffect(() => {
      console.log(Corr)
    }, [Corr])
    
    

    useEffect(() => {
      if (selectedClient) {
        getClient(selectedClient.value)
        getProductosE(selectedClient.value)
      }
      }, [selectedClient]);
  

    const getProductosE = async (cid) => {
      const response = await fetch(`${backendUrl()}/products`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({cid: cid})
      })
      let data = await response.json()
      let datos = data.productos.map((d) => {
        return {value: d._id, label: d.name}
      })
      console.log(datos)
     setProductosE(datos)
    }

    const getCorr = async () => {
      let response = await fetch(`${backendUrl()}/cotizacion/ultima`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({})
      })
      let data = await response.json()
      console.log(data.cotizacion)
      setCorr(parseInt(data.cotizacion.corr)+1)
    }

    const getProductE = async (p) => {
      const response = await fetch(`${backendUrl()}/products/get`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id: p})
      })
      let data = await response.json()
      setNombre(data.producto.name)
      setPrecio(data.producto.price)
      setPhoto_pid(data.producto.photo_pid)
      setSP(true)
    }

    useEffect(() => {
      console.log(productosE);

    }, [productosE]);
    



    const updateProducts = async (data) => {
      setLoadingProducts(true)
      let update = await fetch(`${backendUrl()}/excel/updateProducts`, {
        method: 'PUT',
        body: JSON.stringify(data),
      headers: new Headers({ 'Content-type': 'application/json'})
      })     
       if (update.ok) {
        let status = await update.status
        return status

      } else {
        throw new Error('Error al actualizar los productos');
      }


    } 

    const getClient = async (id) => {
      const response = await fetch(`${backendUrl()}/clients/get`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id})
      })
      let data = await response.json()
      console.log(data)
      if (data.status === 200){
        setCliente(data.cliente)
      } else {
        console.log(data)
      }
    }

    
    const getClients = async (b) => {
      const response = await fetch(`${backendUrl()}/clients`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: b})
      })
      let data = await response.json()
      console.log(data)
      let datos = data.clientes.map((d) => {
        return {value: d._id, label: d.nombre}
      })
     setClientes(datos)
    }


    const addCotizacion = async (cliente, shoppingCart, total, totalIva, iva, fecha, vendedor, nota, Corr, filename) => {
      console.log("addCoti",{cliente_id: cliente._id, nom_cliente: cliente.nombre, productos: shoppingCart, total, totalIva, iva, fecha, vendedor_id: vendedor.email, nom_vendedor: vendedor.nombre, observaciones: nota, Corr, filename})
      let response = await fetch(`${backendUrl()}/cotizacion/add`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({cliente, productos: shoppingCart, total, totalIva, iva, fecha, vendedor, observaciones: nota, Corr, filename})
      })
      let data = await response.json()
      let {_id, __v,...newObj} = data.cotizacion
      setCotiActual(newObj)
      setCorr(parseInt(data.cotizacion.corr)+1)
    }
    const formatMonto = (monto) => {
      return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2, // Mínimo de decimales
        maximumFractionDigits: 2, // Máximo de decimales
      }).format(monto);
    };
    



    const newUpdateProducts = async (data, nombre) => {
      console.log("Entre en newProducts")
      console.log("Datos: ", data)
      let update = await fetch(`http://backend.toyoxpress.com/products`, {
        method: 'POST',
        body: JSON.stringify({data, length: data.length, nombre}),
      headers: new Headers({ 'Content-type': 'application/json'})
      })     
       if (update.ok) {
        let status = await update.status
        return status

      } else {
        throw new Error('Error al actualizar los productos');
      }
    } 
    function horaActual() {
      // Crea un objeto Date para la hora actual en UTC
      const horaActualUtc = new Date();
    
      // Establece la zona horaria de Caracas
      const zonaHorariaCaracas = 'America/Caracas';
    
      // Obtén la hora actual en la zona horaria de Caracas y en español
      const opcionesFecha = {
        timeZone: zonaHorariaCaracas,
        weekday: 'long',   // Día de la semana (nombre completo)
        year: 'numeric',   // Año (ejemplo: 2023)
        month: 'long',    // Mes (nombre completo)
        day: 'numeric',    // Día del mes (ejemplo: 21)
        hour: '2-digit',   // Horas (formato de 12 horas)
        minute: '2-digit', // Minutos
        second: '2-digit', // Segundos
        hour12: true,      // Mostrar en formato de 12 horas (AM/PM)
      };
    
      const horaActualEnCaracas = horaActualUtc.toLocaleString('es-ES', opcionesFecha);
    
      return horaActualEnCaracas;
    }
    

    const updateStock = async (i, dd) => {
      let data = {
        stock: shoppingCart[i].cantidad,
        codigo: shoppingCart[i].Código
      }
      console.log(sended)
      let update = await fetch(`${backendUrl()}/excel/stock`, {
        method: 'PUT',
        body: JSON.stringify(data),
      headers: new Headers({ 'Content-type': 'application/json'})
      })     
       if (update.ok) {
        if (i == shoppingCart.length - 1 && dd === 'correo') {
        MySwal.fire({
          icon: 'success',
          title:'El pedido se ha enviado correctamente!',
          html: <>
          <ul>
            {mostrarSended.map(c => {
              console.log(c)
              return (<li>{`${c.correo}`} {c.stat ? <box-icon name='check-circle' color='#217121' size='18px'></box-icon> : <box-icon name='x-circle' color='#a01113' size='18px'></box-icon>}</li>)
            })}
          </ul>
          </>
        }).then(() => {
          window.location= '/products'
        })
      }
        let status = await update.status
        return status
      } else {
        throw new Error('Error al actualizar el stock');
      }
      
    } 


    useEffect(() => {
      getFecha()
    }, [])

    const getFecha = async () => {
      const response = await fetch(`${backendUrl()}/excel/fecha`)
      let data = await response.json()
      let logs = data.fechas
      data = data.fechas[0].fecha
      
      setFecha(data)
      setLogs(logs)
    };

    function formatDate(timestamp) {
      const date = new Date(timestamp);
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      
      let hours = date.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      const formattedDate = `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
      
      return formattedDate;
    }

    useEffect(() => {
      if (cargaClientes){
        if(cargaClientes.target.files[0] !== undefined) {
      setarchivoClientes(cargaClientes.target.files[0].name);
        }
      }

    }, [cargaClientes]);
    useEffect(() => {
      if (cargaProductos){
        if(cargaProductos.target.files[0] !== undefined) {
      setarchivoProductos(cargaProductos.target.files[0].name);
        }
      }
    

    }, [cargaProductos]);

    


    useEffect(() => {
      if (!cargaClientes){
        soltarAlarmas()
      }
      else if(!cargaProductos) {
        soltarAlarmas()
      }else if (statusCliente && statusProducto) {
        soltarAlarmas()
      }
    }, [statusCliente, statusProducto]);



    const generarPDF = async (cliente) => {
      const blob = await pdf(<MyDocument 
        cliente={cliente} 
        productos={shoppingCart} 
        total={formatMonto(total)} 
        totalIva={formatMonto(totalIva)} 
        iva={formatMonto(iva)} 
        fecha={getFormattedDate()} 
        vendedor={vendedor}
         observaciones={nota} 
         corr={!deepCompare(cot, cotiActual) ? Corr : Corr-1} 
         hora={horaActual()} 
         />).toBlob();
            // Crear un objeto FormData y agregar el Blob bajo la clave "myFile"
            const formData = new FormData();
            formData.append('myFile', blob, 'cotizacion.pdf');
              // Enviar el objeto FormData al servidor
      try {
        await fetch(`${backendUrl()}/upload/`, {
          method: 'POST',
          body: formData,
        }).then(async (response) => {
          if (response.ok){
          let data  = await response.json()
          data = data.data
          setPdfName(data)
          if (!deepCompare(cot, cotiActual)) { 
          addCotizacion(cliente, preShoppingCart, total, totalIva, iva, getFormattedDate(), vendedor, nota, Corr, `Pedido n°${Corr} - ${getFormattedDate()}.pdf`)
          }
          }
        });
        // Manejar la respuesta de la solicitud, si es necesario
      } catch (error) {
        // Manejar errores, si los hay
      }
    }
    

    useEffect(() => {
      if (pdfName){
        generadorEmail(!deepCompare(cot, cotiActual) ? Corr : Corr-1 )
    }
    }, [pdfName]);

    const generadorEmail = (numero) => {
      Swal.fire({
        icon: 'info',
        title: 'El pedido se esta generando', 
        timer: 3000, 
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        
        selectEmail(numero)
      })
    }
    


    
    async function handleSendOrder  (emails) {

      const dataClient = {
        client: sC,
        cart: shoppingCart,
        corr: Corr,
        emails
      }

      console.log(dataClient)
      await fetch(`${backendUrl()}/orders`, {
        method: 'POST',
        body: JSON.stringify({dataClient}),
      headers: new Headers({ 'Content-type': 'application/json'})
      })

    }
    
    async function handleSendMail  (numero, email, msn) {
      const mailOptions = {
        filename: pdfName,
        email: email,
        nota: msn, 
        corr: numero,
        nCliente: cliente.nombre
      }

      let res = false
      await fetch(`${backendUrl()}/upload/sendMail`, {
        method: 'POST',
        body: JSON.stringify({mailOptions}),
      headers: new Headers({ 'Content-type': 'application/json'})
      }).then((response) => {
        if(response.ok) {
          res = true
        } else {res = false}
        setCorreoMsn('')
        setCorreoCliente(true)
      });
      return res
    }
    
    

    const updateClients = async (data) => {
      let update = await fetch(`${backendUrl()}/excel/updateClients`, {
        method: 'PUT',
        body: JSON.stringify(data),
      headers: new Headers({ 'Content-type': 'application/json'})
      })
      if (update.ok) {
        let status = await update.status
        return status
      } else {
        throw new Error('Error al actualizar los clientes');
      }

    }
    


    const getProducts = async () => {
      setLoading(true)
    await fetch(`${backendUrl()}/excel/productsComplete`).then(async (response) => {
        let data = await response.json()
        data = data.excel
        Swal.close()
        entregarInventario(data)
      })
    }

    const handleButtonClick = () => {
      getProducts()
      Swal.fire({
        title: 'Cargando...',
        text: 'Espere un momento mientras se carga inventario...',
        allowOutsideClick: false,
        showConfirmButton: false,
      })
    };

    const getSimpleProducts = async (search, pagina) => {
      console.log(search)
      const response = await fetch(`${backendUrl()}/excel/products`, {
        method:'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({Código: search, pagina})
      })
      let data = await response.json()
      data = data.excel
     setDataProducts(data)
    }

    const pdfInventario = () => {
      // Redirige a la ruta con los datos como parte de la URL
      window.location.href=`${frontUrl()}/pdf`;
    }


    const excelInventario = (data) => {
      let arr = data;
      let nExcel = [];
      
      arr.forEach((m) => {
        if (m["Existencia Actual"] > 0 && !isNaN(parseFloat(m["Precio Minimo"]))) {
          let obj = {
            Código: m.Código,
            "Descripción": m["Nombre Corto"],
            Marca: m.Modelo,
            Precio: parseFloat(m["Precio Minimo"]).toFixed(2), // Ajustar el nombre del campo si es necesario
          };
          nExcel.push(obj);
        } else if (isNaN(m["Precio Minimo"])) {
          console.log('error en el precio, no es un numero', m["Precio Minimo"] )
        }
      });
    
      // Convertir a hoja de Excel
      const worksheet = utils.json_to_sheet(nExcel);
    
      // Modificar el formato de la columna de precios
      worksheet['!cols'] = [{ width: 10 }, { width: 30 }, { width: 20 }, { width: 15, numFmt: '#,##0.00' }];
    
      // Crear libro de Excel y agregar hoja
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Hoja1');
    
      // Escribir archivo de Excel
      writeFile(workbook, 'Inventario.xlsx');
    }
  const traerCor = async () => {
    let cor = await fetch(`${backendUrl()}/pdf/`)
    let data = await cor.json()
    
    setNewCorr(data)
    let prop = data.cor
    console.log(prop >= 9)
    if (prop < 9) {
      console.log('entre en menor a 9');
      setCorr(`00000${prop}`);
    } else if (prop >= 9 && prop < 99) {
      console.log('entre en menor a 99');
      setCorr(`0000${prop}`);
    } else if (prop >= 99 && prop < 999) {
      console.log('entre en menor a 999');
      setCorr(`000${prop}`);
    } else if (prop >= 999 && prop < 9999) {
      console.log('entre en menor a 9999');
      setCorr(`00${prop}`);
    } else if (prop >= 9999 && prop < 99999) {
      console.log('entre en menor a 99999');
      setCorr(`0${prop}`);
    } else if (prop >= 99999 && prop < 999999) {
      console.log('entre en menor a 999999');
      setCorr(`${prop}`);
    }
    console.log(prop)

  }

  useEffect(() => {
    traerCor();
  }, []);


  


  
  
    

  const entregarInventario = (data) => {

    Swal.fire(
    {
      icon: 'info',
      title: 'Seleccione un formato de vista',
      html: `<div class="col-12 row d-flex justify-content-center"><div class="col-6 d-flex justify-content-center"><div id='pdf' class="toyox">PDF</div></div> <div class="col-6 d-flex justify-content-center"><div class="toyox-e" id='excel-t'>Excel</div></div></div>`,
      showConfirmButton: false,
      timer: 4500
    }
    )
      let excel = document.getElementById('excel-t')
      excel.addEventListener('click', () => {
        excelInventario(data)
      })
      let pdf = document.getElementById('pdf')
      pdf.addEventListener('click', () => {
        pdfInventario(data)
      })

   
  }
  
   const insertClients = () => {
    let arr = []
    dataClient.map((c) => {

      arr.push({value: c.Nombre, label: c.Nombre})
    })
    setClientes(arr)
   }

   const searchClients = () => {
    dataClient.map((c) => {
      console.log('entre')
      console.log(c)
     if (c.Nombre === cliente) {
      setSC(c)
      setRif(c.Código)
     }
    })
   }

   const insertProducts = () => {
    let arr = []
    dataProducts.map((c) => {
      arr.push({value: c.Código, label: c.Código})
    })
    setPartes(arr)
   }

   const searchProduct = () => {
    dataProducts.map((c) => {
     if (c.Código === product) {
      console.log('entre en codigo de sp')
      setSP(c)
      setPrecioMayor(c["Precio Mayor"])
      setPrecioMenor(c["Precio Minimo"])
      setPrecioOferta(c["Precio Oferta"])
      setexistencia(c["Existencia Actual"])
      setCódigo(c.Código)
      setReferencia(c.Referencia)
      setNombreCorto(c["Nombre Corto"])
      setMarca(c.Modelo)
     }
    })
   }
   const getFormattedDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const year = String(date.getFullYear()).slice(-2); // Últimos dos dígitos del año
    return `${day}-${month}-${year}`;
  };

    useEffect(() => {
      insertClients()
    }, [dataClient]);
    useEffect(() => {
      console.log('hola')
      searchClients()
    }, [cliente]);


    useEffect(() => {
      console.log("actualizando productos")
      insertProducts()
  }, [dataProducts]);

  useEffect(() => {
    searchProduct()
  }, [product]);

  function preHandleFile() {
    handleFile(cargaClientes, cargaProductos)

  }
  function soltarAlarmas (){
    if (statusCliente == 200 && statusProducto === null) {
      Swal.fire({
        icon: 'success',
        title:'el archivo de clientes ha sido cargado correctamente!',
      })
    } else if (statusProducto == 200 && statusCliente === null) {
      Swal.fire({
        icon: 'success',
        title:'el archivo de productos ha sido cargado correctamente!',
      }) } else if (statusCliente == 200 && statusProducto == 200) {
        Swal.fire({
          icon: 'success',
          title:'Todos los archivos han sido cargados correctamente!',
        })
      }
     else if (statusCliente == 200 && (statusProducto !== 200 && statusProducto !== null)){
      Swal.fire({
        icon: 'success',
        title:'el archivo de clientes ha sido cargado correctamente!',
      }).then(() => {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error con la carga de los productos!'
        })
      })
    } else if (statusProducto == 200 && (statusCliente !== 200 && statusCliente !== null)){
      Swal.fire({
        icon: 'success',
        title:'el archivo de productos ha sido cargado correctamente!',
      }).then(() => {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error con la carga de los clientes!'
        })
      })
    } else if ((statusCliente !== 200 && statusCliente !== null) &&  (statusProducto !== 200 && statusProducto !== null)) {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error con la carga de los excel!'
      })
    }
  }
  function quitarAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  } 

  function formatearPropiedades(array) {
    return array.map(objeto => {
      const nuevoObjeto = {};
      for (const clave in objeto) {
        if (objeto.hasOwnProperty(clave)) {
   const nuevaClave = quitarAcentos(clave)
          nuevoObjeto[nuevaClave] = objeto[clave];
        }
      }
      return nuevoObjeto;
    });
  }

  
    const handleFile = async (event1, event2) => {
      let file1;
      let file2;
      let dato1;
      let dato2;
      if (cargaClientes) {
      file1 = event1.target.files[0];
       dato1 = 'clientes'
      }
      if (cargaProductos) {
         file2 = event2.target.files[0];
         setSendFecha(event2.target.files[0].name)
         dato2 = 'productos'
      }
  

      // Crear un nuevo objeto FileReader
      const reader1 = new FileReader();
      const reader2 = new FileReader()
  
      // Función que se ejecuta cuando se carga el archivo
      reader1.onload = async (event) => {
        const data = event.target.result;
        const workbook = read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let jsonData = utils.sheet_to_json(worksheet, { defval: '' });
        jsonData = formatearPropiedades(jsonData)
        console.log(jsonData,"json")
          let correcto = true;
          let arrErr = [];
          jsonData.map((m) => {
            if (correcto === true) {
              let a = m.hasOwnProperty("Nombre");
              let b = m.hasOwnProperty("Rif");
              let d = m.hasOwnProperty("Telefonos");
              let f = m.hasOwnProperty("Correo Electronico");
              let g = m.hasOwnProperty("Vendedor");
              let h = m.hasOwnProperty("Tipo de Precio");
              let i = m.hasOwnProperty("Ug Est Nombre");
              let j = m.hasOwnProperty("Ug Ciu Nombre");
              let n = m.hasOwnProperty("Ug Mun Nombre")
              let o = m.hasOwnProperty("Direccion")
              let p = m.hasOwnProperty("Vendedores Codigo")
              if (!a || !b || !d  || !f || !g || !h || !i || !j  || !n || !o || !p) {
                if (!a){
                  arrErr.push('No se encuentra el apartado de "Nombre" en el excel!')
                }
                if (!b){
                  arrErr.push('No se encuentra el apartado de "Rif" en el excel!')
                }
                if (!d){
                  arrErr.push('No se encuentra el apartado de "Teléfonos" en el excel!')
                }
                if (!f){
                  arrErr.push('No se encuentra el apartado de "Correo Electronico" en el excel!')
                }
                if (!g){
                  arrErr.push('No se encuentra el apartado de "Vendedor" en el excel!')
                }
                if (!h){
                  arrErr.push('No se encuentra el apartado de "Tipo de Precio" en el excel!')
                }
                if (!i){
                  arrErr.push('No se encuentra el apartado de "Ug Est Nombre" en el excel!')
                }
                if (!j){
                  arrErr.push('No se encuentra el apartado de "Ug Ciu Nombre" en el excel!')
                }
                if (!n){
                  arrErr.push('No se encuentra el apartado de "Ug Mun Nombre" en el excel!')
                }
                if (!o){
                  arrErr.push('No se encuentra el apartado de "Direccion" en el excel!')
                }
                if (!p){
                  arrErr.push('No se encuentra el apartado de "Vendedores Código" en el excel!')
                }
                correcto = false;
              }
            }
          });
          if (correcto) {
            const newArr = jsonData.map(obj => {
              return {
                Rif: obj.Rif,
                "Nombre": obj["Nombre"],
                "Vendedor": obj["Vendedor"],
                "Telefonos": obj["Telefonos"],
                "Correo Electronico": obj["Correo Electronico"],
                "Tipo de Precio": obj["Tipo de Precio"],
                "Estado": obj["Ug Est Nombre"],
                "Ciudad": obj["Ug Ciu Nombre"],
                "Municipio": obj["Ug Mun Nombre"],
                "Direccion": obj["Direccion"],
                "Vendedores Código": obj["Vendedores Codigo"],
              };
            });
            let status = await updateClients(newArr);
            setStatusCliente(status)
          } else {
            MySwal.fire({
              icon: 'error',
              title: 'Oops... ha ocurrido un error en el excel de clientes',
              html: <>
                  {arrErr.map((d) => {
                return <li className='my-2' style={{fontSize: "15px"}}>{d}</li>
              })}
              Por favor, recuerde escribir los nombres como se le indica en el modelo
              </>,
            });
          }

      };
      reader2.onload = async (event) => {
        const data = event.target.result;
        const workbook = read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let jsonData = utils.sheet_to_json(worksheet, { defval: '' });
        jsonData = formatearPropiedades(jsonData)
        console.log(jsonData,"json")
          let correcto = true;
          let arrErr = []
          jsonData.map((m) => {
            if (correcto === true) {
              let a = m.hasOwnProperty("Codigo");
              let b = m.hasOwnProperty("Nombre Corto");
              let c = m.hasOwnProperty("Referencia");
              let d = m.hasOwnProperty("Marca");
              let e = m.hasOwnProperty("Modelo");
              let f = m.hasOwnProperty("Existencia Actual");
              let g = m.hasOwnProperty("Precio Oferta");
              let h = m.hasOwnProperty("Precio Mayor");
              let i = m.hasOwnProperty("Precio Minimo");
    
              if (!a || !b || !c || !d || !e || !f || !g || !h || !i ) {
                if (!a){
                  arrErr.push('No se encuentra el apartado de "Código" en el excel!')
                }
                if (!b){
                  arrErr.push('No se encuentra el apartado de "Nombre Corto" en el excel!')
                }
                if (!c){
                  arrErr.push('No se encuentra el apartado de "Referencia" en el excel!')
                }
                if (!d){
                  arrErr.push('No se encuentra el apartado de "Marca" en el excel!')
                }
                if (!e){
                  arrErr.push('No se encuentra el apartado de "Modelo" en el excel!')
                }
                if (!f){
                  arrErr.push('No se encuentra el apartado de "Existencia Actual" en el excel!')
                }
                if (!g){
                  arrErr.push('No se encuentra el apartado de "Precio Oferta" en el excel!')
                }
                if (!h){
                  arrErr.push('No se encuentra el apartado de "Precio Mayor" en el excel!')
                }
                if (!i){
                  arrErr.push('No se encuentra el apartado de "Precio Minimo" en el excel!')
                }

                correcto = false;
              }
            }
          });
          if (correcto) {
            const newArr = jsonData.map(obj => {
              return {
                "Código": obj["Codigo"],
                "Nombre Corto": obj["Nombre"],
                Referencia: obj.Referencia,
                Marca: obj.Marca,
                Modelo: obj.Modelo,
                "Existencia Actual": obj["Existencia Actual"],
                "Precio Oferta": obj["Precio Oferta"],
                "Precio Mayor": obj["Precio Mayor"],
                "Precio Minimo": obj["Precio Minimo"],
              };
            });
            const newArrUp = jsonData.map(obj => {
              return {
                "Código": obj["Codigo"],
                "Nombre Corto": obj["Nombre"] + " " + obj["Codigo"],
                Marca: obj.Marca,
                "Existencia Actual": obj["Existencia Actual"],
                "Precio Oferta": obj["Precio Oferta"],
                "Precio Mayor": obj["Precio Mayor"],
                "Precio Minimo": obj["Precio Minimo"],
                precio2: obj["Precio Oferta"]
              };
            });
            console.log("newarrup: ",newArrUp)
            let status = await updateProducts(newArr);
            setTotalProducts(newArrUp.length)
             await newUpdateProducts(newArrUp, archivoProductos);
            setStatusProducto(status)
          } else {
            MySwal.fire({
              icon: 'error',
              title: 'Oops... ha ocurrido un error en el excel de productos',
              html: <>
              {arrErr.map((d) => {
                return <li className='my-2' style={{fontSize: "15px"}}>{d}</li>
              })}
              Por favor, recuerde escribir los nombres como se le indica en el modelo
              </>,
            });
          }
      };
      // Leer el archivo como un array buffer
      if (cargaClientes) {
       reader1.readAsArrayBuffer(file1);
      }
      if (cargaProductos) {
       reader2.readAsArrayBuffer(file2);
      }
    };

    const settingShoppingCart = async (params) => {
      addCart(params)
    }
    
    const settingCreateProduct = async (params) => {
      let obj = {
        name: params.nombre,
        price: params.precio,
        note: params.nota, 
        cantidad: params.cantidad, 
        tipo: "manual",
        total: parseFloat(params.precio) * parseInt(params.cantidad)
      }
      addCartManual(obj)
      if (params.save)
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

    const eliminarProducto = (value) => {
      console.log("entre", value)
      let sp = preShoppingCart.filter(cart => {
        console.log(cart.name, value)
        if (cart.name !== value) {
          return cart
        }
      })
      console.log(sp);
      
      setPreShoppingCart(sp)

    }
    const addCart = (n) => {
      console.log(n)
      let arreglo = n.map((m) => {
        const existe = shoppingCart.findIndex((item) => item.name === m.name);
        if (existe !== -1) {
          let obj = {...shoppingCart[existe], cantidad: parseInt(shoppingCart[existe].cantidad) + m.cantidad, total: parseInt(shoppingCart[existe].total) + m.total }
          return obj
        } else {
          return {...m}
        }
      })
      preShoppingCart.map((o) => {
        const existe = arreglo.findIndex((item) => item.name === o.name);
        if (existe === -1) {
          arreglo.push(o)
        } 
      })

      setPreShoppingCart(arreglo);
    }

    const addCartManual = (n) => {
      setPreShoppingCart((prev) => [...prev, n])
    }

  

const MySwal = withReactContent(Swal)

    const selectEmail = (numero) => {
      let att = [];
      console.log(cliente)
      const handleAttachments = (newAttachments) => {
        console.log(newAttachments);
        att = newAttachments
      };
         MySwal.fire({
          icon: 'info',

          html: <>
          <p><h5>¿Cuales son los destinatarios?</h5></p>
          <p><h6>Correo: {cliente.correo}</h6></p>
          <MultiAttachmentInput onAttachmentsChange={handleAttachments}/>
          <div className="col-12 d-flex justify-content-start"><label htmlFor="correoNota">Mensaje:</label></div>
          <div className="col-12 d-flex justify-content-start"><input className='form-control' type="textbox" name="" id="correoNota" onChange={(e) => {
            setCorreoMsn(e.target.value)
           }}/></div>
          
          </>,
          showCancelButton: true,
        }).then(async (result) => {
          if (result.isConfirmed ) {
            let msn = document.getElementById('correoNota').value
              att.push(cliente.correo)
              att.push("mimedina661@gmail.com")
              setCantidadCor(att.length)
              await att.map(async correo => {
                console.log(att)
                let json = {correo, stat: await handleSendMail(numero, correo, msn)}
                setSended(prevList => [...prevList, json])
                if (correo != "pedidostoyoxpress@gmail.com" && correo != "toyoxpressca@gmail.com") {
                  setMostrarSended(prevList => [...prevList, json])
                }
              })
          }
        });
      }
    
      useEffect(() => {
        if(selectedProduct && product) {
          setPartes([])
        }
      }, [selectedProduct, product]);
      

    const selectCart = () => {
      if (!sP) {
        Swal.fire({
          icon: 'error',
          title: 'Por favor, inserte un producto!',
        })
      } else {
        Swal.fire({
          icon: 'info',
          title: '¿Qué cantidad desea añadir?',
          input: 'number',
          showCancelButton: true,
        }).then((result) => {
          let value = Swal.getInput().value
          value = parseInt(value)
          if (result.isConfirmed) {
            addCart(value)
          } else if (!value){
            Swal.fire({
              icon: 'error',
              title: 'Por favor, inserte la cantidad del producto!',
            })
          }
        });
      }
    };

    useEffect(() => {
      if(partes[0]){
        setMenu1(true)
      } else {
        setMenu1(false)
      }
    }, [partes])
    useEffect(() => {
      if(clientes[0]){
        setMenu2(true)
      } else {
        setMenu2(false)
      }
    }, [clientes])

  return (<>
        <SearchModal 
                      show={search}
                      onHide={() => setSearch(false)}
                      settingmounts={settingShoppingCart}
                      cliente={cliente}
                      product={product.data}
                      url={urlPhotos}
      />
      <CreateProductModal 
                            show={cP}
                            onHide={() => setCP(false)}
                            settingmounts={settingCreateProduct}
                            cliente={cliente}
                            product={product.data}
                            url={urlPhotos}
      />

  <div className="d-flex justify-content-center row mt-3 ">
    <div className="row bg-light col-11 py-4">
        <div className="col-12 d-flex justify-content-center row mb-3 mx-0">
        <div className="col-sm-2 mx-1 d-flex align-items-center justify-content-center">Buscar Cliente:</div>
 <div className="col-sm-9 d-flex align-items-center justify-content-center"> <Select options={clientes} components={components} menuIsOpen={menu2} value={selectedClient} isClearable={true} onChange={(e) => {
  console.log(e)
       if (e === null) {
        setSelectedClient(null)
        setCliente({})
        setNombre("")
        setPhoto_pid("")
        setPrecio("")
       } else {
        setSelectedClient(e)
       }
}} placeholder='Introduce el nombre del cliente' onInputChange={(e) => {
          if (e.length >= 4) {
          getClients(e.value)
          } else {
            setClientes([])
          }
        }} className="selectpd px-2"  id='clientela'/>
        </div>
        </div>
        {
          selectedClient ? <div className='row col-12'>
            <div className="col-6 d-flex justify-content-center">
              <button className='btn btn-success ' onClick={() => setSearch(true)}>
                <box-icon name='search-alt-2' color='#ffffff' size="18px"></box-icon>  Buscar producto
                </button>
            </div>
            <div className="col-6 d-flex justify-content-center">
              <button className='btn btn-primary ' onClick={() => setCP(true)} >
                <box-icon name='add-to-queue' type='solid' color='#ffffff' size="18px" ></box-icon> Producto manual
                </button>
              </div>
            </div> : null
        }
    <div className="boton-container col-md-1 align-items-center">
    </div>
    <hr className='mt-2'/>
    <h3 className='sp'>Shopping Cart</h3>
    <div className="col-sm-12 paltable">
        <table class="table">
<thead>
<tr>
  <th class="tg-0pky"><div className='d-flex justify-content-center'>Foto</div></th>
    <th class="tg-0pky"><div className='d-flex justify-content-center'>Nombre</div></th>
    <th class="tg-0pky"><div className='d-flex justify-content-center'>Precio</div></th>
    <th class="tg-0pky"><div className='d-flex justify-content-center'>Cantidad</div></th>
    <th class="tg-0pky"><div className='d-flex justify-content-center'>Acciones</div></th>
    <th class="tg-0pky"><div className='d-flex justify-content-center'>Total sin Iva</div></th>
  </tr>
</thead>
<tbody>
 {shoppingCart ? shoppingCart.map((m, i) => {
  return (
    <tr>
      <td class="tg-0pky"><div className='d-flex justify-content-center'>{m.tipo !== "woo" ?<box-icon name='heart-circle' type='solid' color='#6307d0' ></box-icon>: <img src={`${m.photo_pid}`} alt="" width={80} height={60} />}</div></td>
      <td class="tg-0pky"><div className='d-flex justify-content-center'>{m.name}</div></td>
    <td class="tg-0pky"><div className='d-flex justify-content-center'>{m.price}</div></td>
    <td class="tg-0pky"><div className='d-flex justify-content-center'>{m.cantidad}</div></td>
    <td class="tg-0pky "><div className='d-flex justify-content-center'><button className='btn btn-danger' onClick={(e) => {
      eliminarProducto(m.name)
    }}><box-icon name='trash' type='solid' color='#ffffff' size='20px'></box-icon></button></div></td>
    <td class="tg-0pky"><div className='d-flex justify-content-center'>{m.total}</div></td>
    </tr>
  )
 }): false}
  {shoppingCart[0] ? <tr>      
    <td class="tg-0pky"><h6>Total sin iva: ${formatMonto(total)}</h6></td>
      <td class="tg-0pky"></td>
      <td class="tg-0pky"><h6>Iva 19%: ${formatMonto(iva)}</h6></td>
      <td class="tg-0pky"></td>
      <td class="tg-0pky"></td>
      <td class="tg-0pky"><h6>Total: ${formatMonto(totalIva)}</h6></td>
</tr>: false}
</tbody>
</table>
    </div>
    {!shoppingCart[0] ?    false: <> <hr />
    <div className="col-12 row mb-2"><div className="d-flex justify-content-center"> <div className="mx-2">Nota:</div> <textarea className='nota-text' onChange={(e) => {
      const {value} = e.target
      setNota(value)
    }} cols="60" rows="3"></textarea></div></div> </>}
 
    <div className="col-6 d-flex justify-content-center align-items-center" onClick={async () => {
      if (corDesx === false) {
        setCorDesx(true)
        shoppingCart.map((m, i) => {
          updateStock(i, 'desc')
        })
      }
      hora = horaActual()

    }}>
      <PDFDownloadLink document={<MyDocument cliente={cliente} productos={shoppingCart} total={formatMonto(total)} totalIva={formatMonto(totalIva)} iva={formatMonto(iva)} fecha={getFormattedDate()} vendedor={vendedor} observaciones={nota} corr={deepCompare(cot, cotiActual) ? Corr-1 : Corr} hora={horaActual()} />} onClick={() => {
          console.log("cot", cot)
          console.log("coti", cotiActual)
        if (deepCompare(cot, cotiActual))  {
          console.log("Descargando cotizacion anterior...");
          
        } else { 
          console.log("Diferencias encontradas:");
          addCotizacion(cliente, preShoppingCart, total, totalIva, iva, getFormattedDate(), vendedor, nota, Corr, `Pedido n°${Corr} - ${getFormattedDate()}.pdf`)
        }
        }} fileName={deepCompare({cliente_id: cliente._id, nom_cliente: cliente.nombre, productos: shoppingCart, total, totalIva, iva, fecha: getFormattedDate(), vendedor_id: vendedor.email, nom_vendedor: vendedor.nombre, observaciones: nota, corr: Corr-1, filename: `Pedido n°${Corr-1} - ${getFormattedDate()}.pdf`}, cotiActual) ? `Pedido n°${Corr-1} - ${getFormattedDate()}.pdf` : `Pedido n°${Corr} - ${getFormattedDate()}.pdf` }>
        <div className="toyox" >Descargar</div>
        </PDFDownloadLink>
        </div>

    {!shoppingCart[0] ?  <div className="col-6 d-flex justify-content-center align-items-center">
      <div className="toyox-disabled">Enviar</div>
    </div> :     <div className="col-6 d-flex justify-content-center align-items-center" onClick={() => {
        console.log("cot:", cot)
        console.log("cotiActual:", cotiActual)
      if (!pdfName || !deepCompare(cot, cotiActual)) {

        hora = horaActual()
        generarPDF(cliente)
      } else {
        generadorEmail(Corr-1)
      }
    }}>
      <div className="toyox">Enviar</div>
    </div>}
    <hr  className='mt-2'/>
    <div className="col-12 d-flex justify-content-center align-items-center"><div className="toyox" onClick={(e) => {
      setPreShoppingCart([])
    }}>Vaciar</div></div>
  </div>
    </div>
  </>)
};
