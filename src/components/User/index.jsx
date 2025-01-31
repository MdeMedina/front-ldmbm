import { useEffect, useState }from 'react'
import Navg from '../sub-components/nav'
import Sidebar from '../sub-components/sidebar'
import { backendUrl, frontUrl} from '../../lib/data/server'
import Pagination from 'react-bootstrap/Pagination'
import Select from 'react-select'
import 'boxicons'
import Swal from 'sweetalert2'
function User({}) {


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
  
  const [users, setUsers] = useState([])
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [_id, set_id] = useState('')
  const [deletingUser, setDeletingUser] = useState()
  const [currentPage, setCurrentPage] = useState(0)
const [vPage, setVPage] = useState(10)
const [meEncuentro, setMeEncuentro] = useState(1)
const [estaba, setEstaba] = useState(1)

  const [vendedor, setVendedor] = useState(0);
  

  let numeros = [
    {value: 2, label: 2},
    {value: 3, label: 3},
    {value: 4, label: 4}
  ]

useEffect(() => {
  let diff =  meEncuentro - estaba
  setCurrentPage(currentPage + (vPage * diff))
}, [estaba, meEncuentro])

const handleVPage = (e) => {
  setCurrentPage(0)
  setEstaba(1)
  setMeEncuentro(1)
  setVPage(e.value)
}
  const gettingUsers = () => {
    fetch(`${backendUrl()}/users`).then(res => res.json()).then(({users}) => {
      setUsers(users)

  })
  }
  useEffect(() => {
 gettingUsers()
  }, [])

  const editUsers = (u, i) => { 

        return(<button className='btn btn-primary' data-bs-toggle="modal" data-bs-target={`#actModal-${i}`}><box-icon name='edit-alt' color='#ffffff' ></box-icon></button>)

  }

  const removeUser = async () => {
    await fetch(`${backendUrl()}/users/deleteUser`, {
      method: 'DELETE',
      body: JSON.stringify(deletingUser),
    headers: new Headers({ 'Content-type': 'application/json'})
  }).then(res => res.json()).then(r => setUsers(r)).then(Swal.fire({
    icon: 'success',
    title: 'Usuario Eliminado con exito',
  }))
  }

  const deleteUsers = (u) => {
        return(<button className='btn btn-danger' value={u._id} onClick={(e) => {
      Swal.fire({
        title: 'Estas seguro que deseas eliminar a este usuario?',
        showDenyButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: `Cancelar`,
        denyButtonText: `Eliminar`,
      }).then((result) => { if (result.isDenied) {
        Swal.fire({
          title: 'Estas seguro COMPLETAMENTE de que deseas eliminar a este usuario?',
          showDenyButton: true,
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: `Cancelar`,
          denyButtonText: `Eliminar`,
        }).then(result => {if (result.isDenied){
          setDeletingUser({ _id: u._id})
          removeUser()
        }})
        }
      })

        }}><box-icon name='trash' type='solid' color='#ffffff' ></box-icon></button>)
  }
  const createUser = () => {
    const cPass = document.getElementById('InputPassword2').value
    if (email === ''){
        Swal.fire("Ooops!" ,"Por favor ingrese un correo electronico", "error")
    }else if (!username) {
      Swal.fire("Ooops!" ,"Por favor ingrese un nombre de usuario", "error")
    }else if(password === ''){
      Swal.fire("Ooops!" ,"Por favor ingrese una contraseña", "error")
    }else if (password !== cPass) {
      Swal.fire("Ooops!" ,"Las contraseñas no coinciden", "error")
    }else {
        const registerData = {
            email: email,
            username: username,
            password: password,
            vendedor: vendedor
        }
    fetch(`${backendUrl()}/users/register`, {
        method: 'POST',
        body: JSON.stringify(registerData),
      headers: new Headers({ 'Content-type': 'application/json'})
    }).then(res => res.json()).then(r => setUsers(r)).then(  Swal.fire({
      icon: "success",
      title: "Usuario Creado con exito",
      showConfirmButton: false,
      timer: 1100
    }))

    }
  }
  const actUser = async (u ,i) => {
    const email = document.getElementById(`actInputEmail-${i}`).value
    const username = document.getElementById(`actUsernameInput-${i}`).value



    const actData = {_id: _id,email: email, username: username}
    
    await fetch(`${backendUrl()}/users/updateUser`, {
      method: 'PUT',
      body: JSON.stringify(actData),
    headers: new Headers({ 'Content-type': 'application/json'})
  }).then(res => res.json()).then(r => {
    setUsers(r)
  }).then(Swal.fire({
    icon: 'success',
    title: 'Usuario modificado con exito',
  }))
  }

  let itemPagination = [];
  let pages;
  const filteredResults = () => {
    return users.slice(currentPage, currentPage + vPage)
  }
  
  const nextPage = () => {
    setEstaba(meEncuentro)
    setMeEncuentro(parseFloat(meEncuentro) + 1)
  }
  
  const prevPage = () => {
    setEstaba(meEncuentro)
    setMeEncuentro(parseFloat(meEncuentro) - 1)
  }
  const makePages = () => {
  pages = Math.ceil(users.length / vPage)
  for (let i = 1; i <= pages; i++) {
    if (meEncuentro == i) {
      itemPagination.push(<Pagination.Item active onClick={(e) => {

        if (isNaN(e.target.text)) {
          setEstaba(meEncuentro)

        }else {
        setEstaba(meEncuentro)
        setMeEncuentro(e.target.text)
}
      }}>{i}</Pagination.Item>)
    } else {
      itemPagination.push(<Pagination.Item onClick={(e) => {
        if (isNaN(e.target.text)) {
          setEstaba(meEncuentro)
        }else {
        setEstaba(meEncuentro)
        setMeEncuentro(e.target.text)
}
      }}>{i}</Pagination.Item>)
    }
  }
}
return (
<>
    <div className="d-flex justify-content-center ">
    <div className="container-fluid row  d-flex justify-content-center">
    <div className="row bg-light col-11 filtros">
        <div className="btn btn-success" data-bs-toggle="modal" data-bs-target="#registerModal">Registrar Usuario</div>
        <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="registerModalLabel">Registre un usuario</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <form>
  <div class="mb-3">
    <label for="registerInputEmail1" class="form-label">Email</label>
    <input type="email" class="form-control" id="registerInputEmail1" aria-describedby="emailHelp" onChange={() => {
        const value = document.getElementById('registerInputEmail1').value
        setEmail(value)
    }}/>
  </div>
  <div class="mb-3">
    <label for="usernameInput" class="form-label">Nombre de usuario</label>
    <input type="email" class="form-control" id="usernameInput" aria-describedby="emailHelp" onChange={() => {
        const value = document.getElementById('usernameInput').value
        setUsername(value)
    }}/>
  </div>
  <div class="mb-3">
    <label for="InputPassword1" class="form-label">Contraseña</label>
    <input type="password" class="form-control" id="InputPassword1" onChange={() => {
        const value = document.getElementById('InputPassword1').value
        setPassword(value)
    }}/>
  </div>
  <div class="mb-3">
    <label for="InputPassword2" class="form-label">Confirmar contraseña</label>
    <input type="password" class="form-control" id="InputPassword2" />
  </div>
</form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" onClick={() => createUser()}>Crear</button>
      </div>
    </div>
  </div>
</div>
</div>
<br /><br />
<div className="col-11 bg-light t-mod row d-flex justify-content-start">
<table className="table ">
    <thead>
        <tr>
            <th>Nombre de Usuario</th>
            <th>Correo electronico</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        {
            filteredResults().map((u, i) => {
                return (
                <tr>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td >
                    {editUsers(u, i)}
    <div class="modal fade" id={`actModal-${i}`} tabindex="-1" aria-labelledby="actModalLabel" aria-hidden="true" onClick={() => {
      set_id(u._id)
    }}>
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id={`actModalLabel-${i}`}>Modificar usuario</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <form>
  <div class="mb-3">
    <label for={`actInputEmail-${i}`}  class="form-label">Email</label>
<input type="email" class="form-control" id={`actInputEmail-${i}`} aria-describedby="emailHelp" defaultValue={u.email} />
  


  </div>
  <div class="mb-3">
    <label for={`actUsernameInput-${i}`} class="form-label">Nombre de usuario</label>
    <input type="email" class="form-control" id={`actUsernameInput-${i}`} aria-describedby="emailHelp" defaultValue={u.username}/>
  </div>
</form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" onClick={() => {
          actUser(u ,i)
          }}>Actualizar</button>
      </div>
    </div>
  </div>
</div>
                    {"      "}
                    {deleteUsers(u)}
                </td>
                </tr>
            )})
        }
    </tbody>
    <Pagination>
{  
currentPage > 0 ? <Pagination.Prev onClick={prevPage}/> : false
}
{
  makePages()
}
{itemPagination.map((item) => {
  return item
})}
  {
    users.length > currentPage + vPage ?  <Pagination.Next onClick={nextPage}/> : false
  }
  </Pagination>
</table>
</div>
</div>
</div>
</>
)
}

export default User