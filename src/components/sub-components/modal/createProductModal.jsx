import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2'
import { fabric } from 'fabric';
import { backendUrl } from '../../../lib/data/server';
import 'boxicons'
import { Form } from 'react-bootstrap';

function CreateModal(props) {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [nombre, setNombre] = useState('');
  const [notas, setNotas] = useState('');
  const [pid, setPid] = useState('');
  const [uploading, setUploading] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
   // Estado para la subida
  const [botonera, setBotonera] = useState("mover");

  const handleClick = () => {
    props.settingmounts(nombre, notas, pid);
    setNombre("");
    setNotas("");
    setPid("");
    setCanvas(null)
    setPhotoUploaded(false)
    canvas.dispose();
    props.onHide()
  };



  const initializeCanvas = (imageUrl) => {
    if (canvas && canvasRef.current) {
      canvas.dispose(); // Elimina el canvas existente
    }
  
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current);
  
      fabric.Image.fromURL(imageUrl, (img) => {
        // Ajustar la imagen al tamaño del canvas
        const canvasWidth = fabricCanvas.width;
        const canvasHeight = fabricCanvas.height;
  
        // Calcular la escala para mantener las proporciones
        const scaleX = canvasWidth / img.width;
        const scaleY = canvasHeight / img.height;
        const scale = Math.min(scaleX, scaleY); // Mantiene la proporción original
  
        // Aplicar la escala y centrar la imagen
        img.set({
          scaleX: scale,
          scaleY: scale,
          left: canvasWidth / 2,
          top: canvasHeight / 2,
          originX: "center",
          originY: "center",
          selectable: true, // Hacer la imagen seleccionable
        });
  
        // Limpiar el canvas y añadir la imagen
        fabricCanvas.clear();
        fabricCanvas.add(img);
  
        // Opcional: Deshabilitar el modo de dibujo inicialmente
        fabricCanvas.isDrawingMode = false;
  
        // Renderizar los cambios
        fabricCanvas.renderAll();
      });
  
      setCanvas(fabricCanvas); // Actualizar el estado del canvas
    }
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        initializeCanvas(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const saveEditedImage = async () => {
    if (!canvas) return;
  
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
    });
  
    const folder = props.cliente._id;
    const uploadPreset = 'preset-product';
  
    // Paso 1: Solicitar firma al servidor
    const signatureResponse = await fetch(`http://localhost:5000/photos/generate-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folder, upload_preset: uploadPreset }),
    });
  
    const { signature, timestamp, cloud_name, api_key } = await signatureResponse.json();
  console.log(signature)
    // Paso 2: Subir imagen a Cloudinary con firma
    const formData = new FormData();
    formData.append('file', dataURL);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);
    formData.append('api_key', api_key);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
  
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      console.log(data);
          Swal.fire({
            icon: "success",
            title: "Imagen subida con éxito!",
            showConfirmButton: false,
            timer: 1100
          })
      setUploading(false)
      setPhotoUploaded(true)
      toggleImageSelectable(false)
      setPid(data.public_id)
      canvas.off("mouse:down")
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir imagen');
    }
  };

  const toggleImageSelectable = (isSelectable) => {
    if (!canvas) return;
    setBotonera('mover')
    canvas.off("mouse:down")
    canvas.isDrawingMode = false; 
    // Encontrar la imagen en el canvas
    const image = canvas.getObjects().find((obj) => obj.type === "image");
    if (image) {
      image.set({
        selectable: isSelectable,
        evented: isSelectable, // Permitir eventos solo si es seleccionable
      });
      canvas.renderAll(); // Renderizar los cambios
    }
  };
  
  const enableEraser = () => {
    if (!canvas) return;
    setBotonera('borrar')
    canvas.off("mouse:down")
    toggleImageSelectable(false); // Asegurarnos de que la imagen no sea seleccionable
    canvas.isDrawingMode = false; // Deshabilitar modo de dibujo
    canvas.selection = true; // Habilitar la selección de objetos
  
    canvas.on("mouse:down", (event) => {
      const target = event.target;
  
      // Eliminar solo objetos seleccionables, ignorando la imagen
      if (target && target.selectable) {
        canvas.remove(target); // Eliminar el objeto seleccionado
        canvas.renderAll(); // Renderizar los cambios
      }
    });
  };
  

  
  const enablePencilDrawing = () => {
    if (!canvas) return;
    canvas.off("mouse:down")
    setBotonera('dibujar')

    toggleImageSelectable(false); // Asegurarnos de que la imagen no sea seleccionable
    canvas.isDrawingMode = true; // Habilitar modo de dibujo libre
    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = "red";
  };

  

  return (
    <Modal
      {...props}
      fullscreen={true}
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
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Notas:</Form.Label>
        <Form.Control id="e-concepto" as="textarea" rows={3} onChange={(e) => {
            setNotas(e.target.value)
          }}/>
      </Form.Group>
        <br />
        <label>Foto: </label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          style={{ marginBottom: '10px' }}
        />
        <br />
        <div>
          {
            canvas && !photoUploaded && (<div>
              {
                botonera == 'mover' ?  
                <button className={'btn-seleccionado'} >
                  <box-icon name='pointer' type='solid' size="15px" color="#fff" ></box-icon>
                  {"  "}
                    mover
                </button> : 
                    <button className={'btn-seleccion'} onClick={() => {
                      toggleImageSelectable(true)
                      setBotonera('mover')
                    }}>
                    <box-icon name='pointer' type='solid' size="15px" ></box-icon>  {"  "}
                    mover
                  </button>
              }
    
            {
                botonera == 'dibujar' ?  
                <button className={'btn-seleccionado'} onClick={() => {
                enablePencilDrawing()
                setBotonera('dibujar')
              }}>              
              <box-icon name='pencil' type='solid' size="15px" color="#fff" ></box-icon>
              {"  "}
                dibujar
                </button>: 
                <button className={'btn-seleccion'} onClick={() => {
                  enablePencilDrawing()
                  setBotonera('dibujar')
                }}>              
                <box-icon name='pencil' type='solid' size="15px" ></box-icon>
                {"  "}
                  dibujar
                  </button>
              }
    
    {
                botonera == 'borrar' ?  
                <button className={'btn-seleccionado'}>              
              <box-icon name='eraser' type='solid' size="15px" color="#fff" ></box-icon>
              {"  "}
                borrar
                </button>: 
                <button className={'btn-seleccion'} onClick={() => {
                  enableEraser()
                  setBotonera('borrar')
                }}>              
                <box-icon name='eraser' type='solid' size="15px" ></box-icon>
                {"  "}
                  borrar
                  </button>
              }


           </div> )
          }
        </div>
        <canvas
          ref={canvasRef}
          width="672"
          height="504"
          style={{ border: '1px solid black', marginBottom: '10px' }}
        />
        {
               canvas && !uploading && !photoUploaded ?
                <button className={'btn-guardado'} onClick={() => {
                  saveEditedImage() 
                  setUploading(true)
                  }}><box-icon type='solid' name='cloud-upload' size="15px"></box-icon>{"  "}Subir</button> : canvas && !photoUploaded && uploading ? <button className={'btn-guardado'} >Subiendo...</button> : canvas ?
                  <button className={'btn-guardado'} ><box-icon name='check' color="#4FB112" size="15px"></box-icon></button> : null
              }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Cerrar
        </Button>
        {
          !photoUploaded ?  <Button variant="primary" disabled>Crear</Button> :
          <Button variant="primary" onClick={handleClick}>Crear</Button>
        }

      </Modal.Footer>
    </Modal>
  );
}

export default CreateModal;
