import React, {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';




function EModal(props) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [nombre, setNombre] = useState('')
  const [toc, setToc] = useState('Persona Natural')
  const [giro, setGiro] = useState('')
  const [RUT, setRUT] = useState("")
  const [correo, setCorreo] = useState("")
  const [direccion, setDireccion] = useState("")
  const [contacto, setContacto] = useState("")
  const [visita, setVisita] = useState("")
  const [observacion, setObservacion] = useState("")

  const handleClick = () => {
    if (isDisabled) return;

    setIsDisabled(true); // Deshabilitar el botón
    props.settingMounts(nombre, RUT, correo, direccion, contacto, visita, observacion,  giro, toc);
    setNombre("");
    setRUT("");
    setCorreo("");
    setDireccion("");
    setContacto("");
    setVisita("");
    setObservacion("");
    setGiro("");
    setToc("");

    // // Opcional: volver a habilitar después de completar la acción
    setTimeout(() => setIsDisabled(false), 2000); // Reemplaza "2000" con el tiempo necesario
  };


  useEffect(() => {
    console.log(toc);
    
  }, [toc])
  

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
          <div className="row">
          <div id="error" className='desaparecer'>*Por Favor, rellene todos los campos</div>
          <div className="col-4 d-flex justify-content-center">Tipo de cliente:</div>
          <div class="form-check col-4 d-flex justify-content-center">
           <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked={toc !== "Empresa"} onClick={(e) => {
           if(e.target.checked){
             setToc('Persona Natural')
           }} } />
            <label class="form-check-label" for="flexRadioDefault1">
            Persona Natural
            </label>
          </div>
          <div class="form-check col-4 d-flex justify-content-center">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked={toc == "Empresa"} onClick={(e) => {
           if(e.target.checked){
             setToc('Empresa')
           }} }/>
            <label class="form-check-label" for="flexRadioDefault2">
            Empresa
            </label>
        </div>
        <hr className='mt-2'/>
          <div className="col-xs-12 col-6 mb-2">
          <label>Nombre: </label>
          <input type="text" onChange={
            (e) => setNombre(e.target.value)
          } className='form-control' />
          </div>
          <div className="col-xs-12 col-6 mb-2">
      <label>RUT: </label>
          <input type="text" onChange={
            (e) => setRUT(e.target.value)
          } className='form-control' />
          </div>

            {
              toc === 'Empresa' ? (  <div className="col-xs-12 col-6 mb-2">
                <label>Giro: </label>
                    <input type="text" onChange={
                      (e) => setGiro(e.target.value)
                    } className='form-control' />
                    </div>) : null
            }

          <br />
          <div className="col-xs-12 col-6 mb-2">
          <label>Correo: </label>
          <input type="text" onChange={
            (e) => setCorreo(e.target.value)
          } className='form-control' />
          </div>
          <br />
          <div className="col-xs-12 col-6 mb-2">
      <label>Direccion: </label>
          <input type="text" onChange={
            (e) => setDireccion(e.target.value)
          } className='form-control' />
          </div>
          <br />
          <div className="col-xs-12 col-6 mb-2">
      <label>Teléfono: </label>
          <input type="text" onChange={
            (e) => setContacto(e.target.value)
          } className='form-control' />
          </div>
          <br />
          <div className="col-xs-12 col-6 mb-2">
      <label>Horario de visita: </label>
          <input type="text" onChange={
            (e) => setVisita(e.target.value)
          } className='form-control' />
          </div>
     <br />
     </div>
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