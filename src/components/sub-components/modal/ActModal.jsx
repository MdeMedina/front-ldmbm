import React, {useState} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';




function ActModal(props) {
  const [isDisabled, setIsDisabled] = useState(false);
  const {cliente, settingmounts} = props;
  console.log("cliente:", cliente)
  const [nombre, setNombre] = useState(cliente.nombre)
  const [RUT, setRUT] = useState(cliente.RUT)
  const [correo, setCorreo] = useState(cliente.correo)
  const [direccion, setDireccion] = useState(cliente.direccion)
  const [contacto, setContacto] = useState(cliente.contacto)
  const [visita, setVisita] = useState(cliente.visita)
  const [observacion, setObservacion] = useState(cliente.observacion)

  const handleClick = () => {
    if (isDisabled) return;

    setIsDisabled(true); // Deshabilitar el botón
    console.log(nombre, RUT, correo, direccion, contacto, visita, observacion)

    settingmounts(nombre ? nombre : cliente.nombre, RUT ? RUT : cliente.RUT, correo ? correo : cliente.correo, direccion ? direccion : cliente.direccion, contacto ? contacto : cliente.contacto, visita ? visita : cliente.visita, observacion ? observacion : cliente.observacion);
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
          <Modal.Title>Editar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="error" className='desaparecer'>*Por Favor, rellene todos los campos</div>
          <label>Nombre: </label>
          <input type="text" defaultValue={cliente.nombre} onChange={
            (e) => setNombre(e.target.value)
          } className='form-control' />
      <br />
      <label>RUT: </label>
          <input type="text" defaultValue={cliente.RUT} onChange={
            (e) => setRUT(e.target.value)
          } className='form-control' />
      <br />
      <label>Correo: </label>
          <input type="text" defaultValue={cliente.correo} onChange={
            (e) => setCorreo(e.target.value)
          } className='form-control' />
      <br />
      <label>Direccion: </label>
          <input type="text" defaultValue={cliente.direccion} onChange={
            (e) => setDireccion(e.target.value)
          } className='form-control' />
      <br />
      <label>Contacto: </label>
          <input type="text" defaultValue={cliente.contacto} onChange={
            (e) => setContacto(e.target.value)
          } className='form-control' />
      <br />
      <label>Horario de visita: </label>
          <input type="text" defaultValue={cliente.visita} onChange={
            (e) => setVisita(e.target.value)
          } className='form-control' />
     <br />
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Observaciones:</Form.Label>
        <Form.Control id="e-concepto" as="textarea" defaultValue={cliente.Observaciones} rows={3} onChange={(e) => {
            setObservacion(e.target.value)
          }}/>
      </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleClick} disabled={isDisabled}>
            Editar
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export default ActModal