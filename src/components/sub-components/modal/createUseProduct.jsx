import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'boxicons'
import { Form } from 'react-bootstrap';

function CreateProductModal(props) {
 const [nombre, setNombre] = useState('');
  const [notas, setNotas] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [save, setSave] = useState(false);
   // Estado para la subida

  const handleClick = () => {
    props.settingmounts({nombre, notas, precio, cantidad, save});
    setNombre("");
    setNotas("");
    setPrecio("")
    setCantidad("")
    props.onHide()
  };







  

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>Nombre: </label>
        <input type="text" onChange={(e) => setNombre(e.target.value)} className="form-control" />
        <br />
        <label>Precio: </label>
        <input type="text" onChange={(e) => setPrecio(e.target.value)} className="form-control" />
        <br />
        <label>Cantidad: </label>
        <input type="text" onChange={(e) => setCantidad(e.target.value)} className="form-control" />
        <br />
        <input type="checkbox" onChange={(e) => setSave(e.target.value)} className='form-check-input mx-2' id='check-save'/>
        <label for="check-save">Guardar Producto </label>
        <br />
        <br />
        {
            save ?         <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Notas:</Form.Label>
            <Form.Control id="e-concepto" as="textarea" rows={3} onChange={(e) => {
                setNotas(e.target.value)
              }}/>
          </Form.Group> : false
        }
        <br />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Cerrar
        </Button>
          <Button variant="primary" onClick={handleClick}>Crear</Button>

      </Modal.Footer>
    </Modal>
  );
}

export default CreateProductModal;
