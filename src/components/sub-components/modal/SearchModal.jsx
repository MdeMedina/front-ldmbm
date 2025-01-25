import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { backendUrl } from '../../../lib/data/server';

function SearchModal(props) {
  const inputRef = useRef(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [sP, setSP] = useState([]);
  const [productos, setProductos] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleClick = () => {
    if (isDisabled) return;
    setIsDisabled(true);
    props.settingmounts(sP);
    setSP([]);
    props.onHide()
    setTimeout(() => setIsDisabled(false), 2000); // Reemplaza "2000" con el tiempo necesario
  };

  useEffect(() => {
    console.log(sP);
    
  }, [sP])
  const handleSearch = async () => {
    setSearching(true);
    try {
      let response = await fetch(`${backendUrl()}/woo/filter`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: inputRef.current.value })
      }).then(setSearching(false));
      let data = await response.json();
      let pd = data.map((d) => {
        if (d.regular_price !== "") {
          return {
            name: d.name,
            price: d.regular_price,
            cantidad: d.stock_quantity ? d.stock_quantity : 0,
            photo:d.images[0] ? d.images[0].src : null,
            tipo: "woo"
          };
        }
      });
      setProductos(pd);
      handleSearchOnDB(pd)
    } catch (e) {
      console.log(e);
      setSearching(false);
      alert("Ha ocurrido un error :(");
    }
  };

  const handleSearchOnDB = async (arr) => {
    setSearching(true);
    console.log(arr)
    try {
      let response = await fetch(`${backendUrl()}/uproducts`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: inputRef.current.value })
      }).then(setSearching(false));
      let data = await response.json();
      let pd = data.productos.map((d) => {
          return {
            name: d.name,
            price: d.price,
            cantidad: 99999,
            tipo: "manual"
          };
      });
      console.log(arr, pd)
      setProductos([...arr, ...pd]);
    } catch (e) {
      console.log(e);
      setSearching(false);
      alert("Ha ocurrido un error :(");
    }
  };

  useEffect(() => {
    console.log(productos);

  }, [productos]);
  

  const handleChange = (e, id, max, price, photo, tipo) => {
    let value = parseInt(e.target.value);
    

    if (value > max) value = max;

    setSP((prev) => {

      const existe = prev.findIndex((item) => item.name === id);
      console.log(existe);
      
      if (value === 0) {
        // Si la cantidad es 0, eliminar el producto
        return prev.filter((item) => item.name !== id);
      }

      if (existe >= 0) {
        // Si el producto ya existe, actualiza su cantidad
        return prev.map((item) =>
          item.name === id
            ? { ...item, cantidad: value, total: parseFloat(item.price) * value, }
            : item
        );
      } else {
        // Si el producto no está en el array, agregarlo
        return [
          ...prev,
          { name: id, cantidad: value, price, total: parseFloat(price) * value, photo_pid: photo, tipo }
        ];
      }
    });
  };


  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>Nombre: </label>
        <div className="d-flex">
          <input type="text" ref={inputRef} className='form-control' />
          <button className="btn btn-success m-2" onClick={handleSearch}>Buscar</button>
        </div>
        <hr />
        {productos.length ? (
          <div className="col-sm-12 paltable">
            <table className="table">
              <thead>
                <tr>
                  <th className="tg-0pky"><div className='d-flex justify-content-center'>Nombre</div></th>
                  <th className="tg-0pky"><div className='d-flex justify-content-center'>Tipo</div></th>
                  <th className="tg-0pky"><div className='d-flex justify-content-center'>Precio</div></th>
                  <th className="tg-0pky"><div className='d-flex justify-content-center'>Disponibilidad</div></th>
                  <th className="tg-0pky"><div className='d-flex justify-content-center'>Cantidad</div></th>
                </tr>
              </thead>
              <tbody>
                {searching ? <h2>Cargando Productos...</h2> : productos.map((m, i) => {
                  if (m) {
                    return (
                      <tr key={m.name}>
                        <td className="tg-0pky"><div className='d-flex justify-content-center'>{m.name}</div></td>
                        <th className="tg-0pky"><div className='d-flex justify-content-center'>{m.tipo}</div></th>
                        <td className="tg-0pky"><div className='d-flex justify-content-center'>{m.price}</div></td>
                        <td className="tg-0pky"><div className='d-flex justify-content-center'>{m.cantidad}</div></td>
                        <td className="tg-0pky"><div className='d-flex justify-content-center'>
                          <input
                            type="number"
                            max={m.cantidad}
                            min={0}
                            value={sP.find((product) => product.name === m.name)?.cantidad || 0}
                            onChange={(e) => handleChange(e, m.name, m.cantidad, m.price, m.photo, m.tipo)}
                            className='form-control'
                          />
                        </div></td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        ) : <div>Porfavor seleccione parámetros para realizar la búsqueda</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>Cerrar</Button>
        <Button variant="primary" onClick={handleClick} disabled={isDisabled}>Agregar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SearchModal;
