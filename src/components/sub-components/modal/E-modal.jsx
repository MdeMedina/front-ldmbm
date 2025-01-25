import React, {useState} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';




function EModal(props) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [nombre, setNombre] = useState('')
  const [RUT, setRUT] = useState("")
  const [correo, setCorreo] = useState("")
  const [direccion, setDireccion] = useState("")
  const [contacto, setContacto] = useState("")
  const [visita, setVisita] = useState("")
  const [observacion, setObservacion] = useState("")

  const handleClick = () => {
    if (isDisabled) return;

    setIsDisabled(true); // Deshabilitar el botón
    props.settingMounts(nombre, RUT, correo, direccion, contacto, visita, observacion);
    // setNombre("");
    // setRUT("");
    // setCorreo("");
    // setDireccion("");
    // setContacto("");
    // setVisita("");
    // setObservacion("");

    // // Opcional: volver a habilitar después de completar la acción
    setTimeout(() => setIsDisabled(false), 2000); // Reemplaza "2000" con el tiempo necesario
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
          <Modal.Title>Nuevo Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="error" className='desaparecer'>*Por Favor, rellene todos los campos</div>
          <label>Nombre: </label>
          <input type="text" onChange={
            (e) => setNombre(e.target.value)
          } className='form-control' />
      <br />
      <label>RUT: </label>
          <input type="text" onChange={
            (e) => setRUT(e.target.value)
          } className='form-control' />
      <br />
      <label>Correo: </label>
          <input type="text" onChange={
            (e) => setCorreo(e.target.value)
          } className='form-control' />
      <br />
      <label>Direccion: </label>
          <input type="text" onChange={
            (e) => setDireccion(e.target.value)
          } className='form-control' />
      <br />
      <label>Contacto: </label>
          <input type="text" onChange={
            (e) => setContacto(e.target.value)
          } className='form-control' />
      <br />
      <label>Horario de visita: </label>
          <input type="text" onChange={
            (e) => setVisita(e.target.value)
          } className='form-control' />
     <br />
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Observaciones:</Form.Label>
        <Form.Control id="e-concepto" as="textarea" rows={3} onChange={(e) => {
            setObservacion(e.target.value)
          }}/>
      </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleClick} disabled={isDisabled}>
            Crear
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export default EModal