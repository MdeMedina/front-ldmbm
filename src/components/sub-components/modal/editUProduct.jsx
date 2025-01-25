import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'boxicons'
import { Form } from 'react-bootstrap';

function EditUProductModal(props) {
    const [nombre, setNombre] = useState(props.nombre);
    const [notas, setNotas] = useState(props.nota);
    const [precio, setPrecio] = useState(props.precio);
     // Estado para la subida
  
    useEffect(() => {
        setNombre(props.nombre)
        setNotas(props.nota)
        setPrecio(props.precio)
    }, [props])
    
    const handleClick = () => {
      props.settingMounts(nombre, notas, precio, props._id);
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
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Nombre: </label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="form-control" />
          <br />
          <label>Precio: </label>
          <input type="text" value={precio} onChange={(e) => setPrecio(e.target.value)} className="form-control" />
          <br />
          <br />
             <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Notas:</Form.Label>
              <Form.Control id="e-concepto" as="textarea" value={notas} rows={3} onChange={(e) => {
                  setNotas(e.target.value)
                }}/>
            </Form.Group>
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Cerrar
          </Button>
            <Button variant="primary" onClick={handleClick}>Editar</Button>
  
        </Modal.Footer>
      </Modal>);
}

export default EditUProductModal;
